import { isValidDate } from "./dateValidator";

// Field 只描述列，不负责层级关系；关系通过 Table 的 parentId 建模更清晰。
type Field = { fieldName: string; fieldType: string };
type Table = { id: number; tableName: string; parentId: number; width: number; fieldTypeX: number; fields: Field[] };

function detectType(v: any): string {
  if (v === null) return "null";
  if (v instanceof Date) return "date";
  const t = typeof v;
  if (t === "string") return isValidDate(v) ? "date" : "string";
  if (t === "number") return Number.isInteger(v) ? "integer" : "decimal";
  if (t === "boolean") return "boolean";
  return "object"; // array 或 object
}

function mergeFieldOrder(existing: Field[], candidate: Field[]): Field[] {
  const seen = new Set(existing.map(f => f.fieldName));
  for (const f of candidate) {
    if (!seen.has(f.fieldName)) {
      existing.push(f);
      seen.add(f.fieldName);
    }
  }
  return existing;
}

export function parseJsonToTables(input: any): Table[] {
  let nextId = 1;
  const tables: Table[] = [];

  function addTable(tableName: string, parentId: number): Table {
    const table: Table = { id: nextId++, tableName, width: 0, fieldTypeX: 0, parentId, fields: [] };
    tables.push(table);
    return table;
  }

  function updateFieldLength(table: Table) {
    const totalLength = table.fields.reduce((max, f) => {
      const len = f.fieldName.length + f.fieldType.length;
      return Math.max(max, len);
    }, 0);
    const maxTypeLength = table.fields.reduce((max, f) => {
      return Math.max(max, f.fieldType.length);
    }, 0);
    table.width = (totalLength * 10) + 30;
    table.fieldTypeX = table.width - ((maxTypeLength * 10) - 20);
  }

  function handleNode(node: any, tableName: string, parentId: number) {
    const table = addTable(tableName, parentId);

    // 对象：拆分原子字段与子节点
    if (node && !Array.isArray(node) && typeof node === "object") {
      for (const key of Object.keys(node)) {
        const val = node[key];
        const t = detectType(val);
        if (t === "object") {
          if (Array.isArray(val)) {
            handleArray(val, key, table.id);
          } else {
            handleNode(val, key, table.id);
          }
        } else {
          table.fields.push({ fieldName: key, fieldType: t });
        }
      }
      updateFieldLength(table);
    }
    // 数组：仅在顶层调用时会到这里，正常应由 handleArray 处理
    else if (Array.isArray(node)) {
      handleArray(node, tableName, parentId);
    }
    // 原子：不生成表字段（由父级处理），此分支通常不触达
  }

  function handleArray(arr: any[], tableName: string, parentId: number) {
    if (arr.length === 0) {
      // 空数组，生成空字段表
      addTable(tableName, parentId);
      return;
    }
    // 判断元素类型
    const firstNonNull = arr.find(v => v !== null);
    const t = detectType(firstNonNull);
    if (t === "object") {
      // 数组元素是对象：合并字段并生成子表
      const mergedFields: Field[] = [];
      for (const item of arr) {
        if (item && typeof item === "object" && !Array.isArray(item)) {
          const fields: Field[] = [];
          for (const k of Object.keys(item)) {
            const vt = detectType(item[k]);
            if (vt !== "object") fields.push({ fieldName: k, fieldType: vt });
          }
          mergeFieldOrder(mergedFields, fields);
        }
      }
      const table = addTable(tableName, parentId);
      table.fields = mergedFields;
      updateFieldLength(table);
      // 处理对象元素中的嵌套对象/数组
      for (const item of arr) {
        if (item && typeof item === "object" && !Array.isArray(item)) {
          for (const k of Object.keys(item)) {
            const v = item[k];
            const vt = detectType(v);
            if (vt === "object") {
              if (Array.isArray(v)) handleArray(v, k, table.id);
              else handleNode(v, k, table.id);
            }
          }
        }
      }
    } else {
      // 原子数组，当作父表的字段（由父节点处理），此处生成一张仅含字段的表也可
      const table = addTable(tableName, parentId);
      table.fields.push({ fieldName: tableName, fieldType: `${t}[]` });
    }
  }

  // 入口：无根键时加 root
  handleNode(input, "root", 0);
  return tables;
}
