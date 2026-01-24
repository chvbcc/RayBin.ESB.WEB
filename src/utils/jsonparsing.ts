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

        // 过滤空数组
        if (Array.isArray(val) && val.length === 0) {
          continue;
        }

        const t = detectType(val);

        if (t === "object") {
          if (Array.isArray(val)) {
            // 检查数组元素类型
            const firstNonNull = val.find(v => v !== null);
            const elemType = detectType(firstNonNull);
            if (elemType === "object") {
              // 数组元素是对象，创建新表处理
              handleArray(val, key, table.id);
            } else {
              // 数组元素是简单类型，作为字段添加到当前表
              table.fields.push({ fieldName: key, fieldType: `${elemType}[]` });
            }
          } else {
            handleNode(val, key, table. id);
          }
        } else {
          table.fields. push({ fieldName: key, fieldType: t });
        }
      }
      updateFieldLength(table);
    } else if (Array.isArray(node)) {
      // 检查数组元素类型
      const firstNonNull = node.find(v => v !== null);
      const elemType = detectType(firstNonNull);
      if (elemType === "object") {
        // 数组元素是对象，创建新表处理
        handleArray(node, tableName, parentId);
      } else {
        // 数组元素是简单类型，作为字段添加到当前表
        table.fields.push({ fieldName: tableName, fieldType: `${elemType}[]` });
        updateFieldLength(table);
      }
    }
  }

  function handleArray(arr: any[], tableName:  string, parentId: number) {
    // 过滤空数组
    if (arr.length === 0) {
      return;
    }

    const firstNonNull = arr.find(v => v !== null);
    const t = detectType(firstNonNull);
    if (t === "object") {
      const mergedFields: Field[] = [];
      const seenFields = new Set<string>();

      // 第一次遍历：收集所有非对象字段
      for (const item of arr) {
        if (item && typeof item === "object" && ! Array.isArray(item)) {
          for (const k of Object.keys(item)) {
            const v = item[k];
            const vt = detectType(v);

            // 过滤空数组
            if (Array.isArray(v) && v.length === 0) {
              continue;
            }

            if (vt !== "object") {
              // 简单类型字段，直接添加到 mergedFields
              if (!seenFields.has(k)) {
                mergedFields.push({ fieldName: k, fieldType: vt });
                seenFields.add(k);
              }
            } else if (Array.isArray(v)) {
              // 数组类型，检查元素类型
              const arrFirstNonNull = v.find(vv => vv !== null);
              const arrElemType = detectType(arrFirstNonNull);
              if (!seenFields.has(k)) {
                mergedFields.push({ fieldName: k, fieldType: `${arrElemType}[]` });
                seenFields.add(k);
              }
            }
          }
        }
      }

      // 创建主表
      const table = addTable(tableName, parentId);
      table.fields = mergedFields;
      updateFieldLength(table);

      // 第二次遍历：处理嵌套对象
      for (const item of arr) {
        if (item && typeof item === "object" && !Array.isArray(item)) {
          for (const k of Object.keys(item)) {
            const v = item[k];
            const vt = detectType(v);

            // 过滤空数组
            if (Array.isArray(v) && v.length === 0) {
              continue;
            }

            if (vt === "object" && !Array.isArray(v)) {
              // 嵌套对象，创建子表
              handleNode(v, k, table.id);
            }
          }
        }
      }
    }
    // 简单类型数组不再创建新表，而是作为字段添加到调用方的表中
  }

  // 检查输入是否为字符串，如果是则尝试解析为JSON
  let parsedInput = input;
  if (typeof input === "string") {
    try {
      parsedInput = JSON.parse(input);
    } catch {
      // 如果解析失败，将其视为普通字符串处理
      parsedInput = input;
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

  // 处理顶层输入
  if (Array.isArray(parsedInput)) {
    // 检查数组元素类型
    const firstNonNull = parsedInput.find(v => v !== null);
    const elemType = detectType(firstNonNull);
    if (elemType === "object") {
      // 数组元素是对象，创建新表处理
      handleArray(parsedInput, "root", 0);
    } else {
      // 数组元素是简单类型，作为字段添加到当前表
      const table = addTable("root", 0);
      table.fields.push({ fieldName: "root", fieldType: `${elemType}[]` });
      updateFieldLength(table);
    }
  } else if (parsedInput && typeof parsedInput === "object") {
    // 顶层只有复杂结构：不创建 root，直接处理每个子结构
    if (!hasSimpleValues(parsedInput)) {
      for (const key of Object.keys(parsedInput)) {
        const val = parsedInput[key];

        // 过滤空数组
        if (Array.isArray(val) && val.length === 0) {
          continue;
        }

        if (Array.isArray(val)) {
          // 检查数组元素类型
          const firstNonNull = val.find(v => v !== null);
          const elemType = detectType(firstNonNull);
          if (elemType === "object") {
            // 数组元素是对象，创建新表处理
            handleArray(val, key, 0);
          } else {
            // 数组元素是简单类型，作为字段添加到当前表
            const table = addTable(key, 0);
            table.fields.push({ fieldName: key, fieldType: `${elemType}[]` });
            updateFieldLength(table);
          }
        } else {
          handleNode(val, key, 0);
        }
      }
    } else {
      // 有简单值：正常创建 root table
      handleNode(parsedInput, "root", 0);
    }
  } else {
    // 简单类型，创建一个表并添加为字段
    const table = addTable("root", 0);
    const t = detectType(parsedInput);
    table.fields.push({ fieldName: "root", fieldType: t });
    updateFieldLength(table);
  }

  return tables;
}
