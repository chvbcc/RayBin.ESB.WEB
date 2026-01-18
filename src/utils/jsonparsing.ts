import { isValidDate } from "./dateValidator";

type Field = { fieldName: string; fieldType:  string };
type Table = { id: number; tableName: string; parentId: number; width: number; fieldTypeX: number; fields:  Field[] };

function detectType(v: any): string {
  if (v === null) return "null";
  if (v instanceof Date) return "date";
  const t = typeof v;
  if (t === "string") return isValidDate(v) ? "date" : "string";
  if (t === "number") return Number.isInteger(v) ? "integer" : "decimal";
  if (t === "boolean") return "boolean";
  return "object";
}

function mergeFieldOrder(existing: Field[], candidate: Field[]): Field[] {
  const seen = new Set(existing.map(f => f. fieldName));
  for (const f of candidate) {
    if (!seen.has(f.fieldName)) {
      existing.push(f);
      seen.add(f.fieldName);
    }
  }
  return existing;
}

export function parseJsonToTables(input:  any): Table[] {
  let nextId = 1;
  const tables: Table[] = [];

  function addTable(tableName:  string, parentId: number): Table {
    const table: Table = { id: nextId++, tableName, width: 0, fieldTypeX:  0, parentId, fields:  [] };
    tables.push(table);
    return table;
  }

  function updateFieldLength(table: Table) {
    const totalLength = table.fields. reduce((max, f) => {
      const len = f.fieldName.length + f.fieldType.length;
      return Math. max(max, len);
    }, 0);
    const maxTypeLength = table.fields.reduce((max, f) => {
      return Math.max(max, f.fieldType.length);
    }, 0);
    table.width = (totalLength * 10) + 30;
    table.fieldTypeX = table. width - ((maxTypeLength * 10) - 20);
  }

  function handleNode(node: any, tableName: string, parentId: number) {
    const table = addTable(tableName, parentId);

    if (node && !Array.isArray(node) && typeof node === "object") {
      for (const key of Object.keys(node)) {
        const val = node[key];
        const t = detectType(val);

        if (t === "object") {
          if (Array.isArray(val)) {
            handleArray(val, key, table.id);
          } else {
            handleNode(val, key, table. id);
          }
        } else {
          table.fields. push({ fieldName: key, fieldType: t });
        }
      }
      updateFieldLength(table);
    } else if (Array.isArray(node)) {
      handleArray(node, tableName, parentId);
    }
  }

  function handleArray(arr: any[], tableName:  string, parentId: number) {
    if (arr.length === 0) {
      addTable(tableName, parentId);
      return;
    }
    const firstNonNull = arr.find(v => v !== null);
    const t = detectType(firstNonNull);
    if (t === "object") {
      const mergedFields: Field[] = [];
      for (const item of arr) {
        if (item && typeof item === "object" && ! Array.isArray(item)) {
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
      for (const item of arr) {
        if (item && typeof item === "object" && !Array.isArray(item)) {
          for (const k of Object.keys(item)) {
            const v = item[k];
            const vt = detectType(v);
            if (vt === "object") {
              if (Array.isArray(v)) handleArray(v, k, table. id);
              else handleNode(v, k, table.id);
            }
          }
        }
      }
    } else {
      const table = addTable(tableName, parentId);
      table.fields.push({ fieldName: tableName, fieldType: `${t}[]` });
    }
  }

  // 检查顶层对象是否包含简单值
  function hasSimpleValues(obj: any): boolean {
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
      return false;
    }
    for (const key of Object. keys(obj)) {
      const val = obj[key];
      const t = detectType(val);
      if (t !== "object") {
        return true; // 有简单值
      }
    }
    return false; // 是复杂结构
  }

  // 顶层只有复杂结构：不创建 root，直接处理每个子结构
  if (!hasSimpleValues(input) && input && typeof input === "object" && !Array.isArray(input)) {
    for (const key of Object.keys(input)) {
      const val = input[key];
      if (Array.isArray(val)) {
        handleArray(val, key, 0);
      } else {
        handleNode(val, key, 0);
      }
    }
    return tables;
  }

  // 有简单值：正常创建 root table
  handleNode(input, "root", 0);
  return tables;
}
