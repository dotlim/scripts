const mapTag = '[object Map]';
const setTag = '[object Set]';
const arrayTag = '[object Array]';
const objectTag = '[object Object]';
const argsTag = '[object Arguments]';

const boolTag = '[object Boolean]';
const dateTag = '[object Date]';
const numberTag = '[object Number]';
const stringTag = '[object String]';
const symbolTag = '[object Symbol]';
const errorTag = '[object Error]';
const regexpTag = '[object RegExp]';
const funcTag = '[object Function]';

const deepTags = [arrayTag, objectTag, mapTag, setTag, argsTag];

const hasOWn = (target, key) => Object.prototype.hasOwnProperty.call(target, key);

function isObject(target) {
  const type = typeof target;
  return type !== null && (type === 'object' || type === 'function');
}

function getType(target) {
  return Object.prototype.toString.call(target);
}

function getInit(target) {
  return new target.constructor();
}

function cloneRegExp(target) {
  const reFlags = /\w*$/;
  const result = new RegExp(target.source, reFlags.exec(target));
  result.lastIndex = target.lastIndex;
  return result;
}

function cloneFunc(target) {}

function cloneOther(target, type) {
  switch (type) {
    case numberTag:
    case stringTag:
    case boolTag:
    case dateTag:
    case errorTag:
      return new target.constructor(target.valueOf());
    case regexpTag:
      return cloneRegExp(target);
    case funcTag:
      return cloneFunc(target);
    default:
      return null;
  }
}

/**
 * 完整克隆
 */
export function cloneDeep(target, map = new WeakMap()) {
  if (!isObject(target)) return target;

  const type = getType(target);

  let cloneTarget;

  if (deepTags.includes(type)) {
    cloneTarget = getInit(target);
  } else {
    return cloneOther(target, type);
  }

  if (map.has(target)) return map.get(target);

  map.set(target, cloneTarget);

  if (type === setTag) {
    target.forEach(value => {
      cloneTarget.add(cloneDeep(value, map));
    });
    return cloneTarget;
  }

  if (type === mapTag) {
    target.forEach((value, key) => {
      cloneTarget.set(key, cloneDeep(value, map));
    });
    return cloneTarget;
  }

  for (let key of Reflect.ownKeys(target)) {
    if (hasOWn(target, key)) {
      cloneTarget[key] = cloneDeep(target[key], map);
    }
  }

  return cloneTarget;
}

/**
 * 简单克隆
 */
export function cloneDeep2(obj, map = new WeakMap()) {
  if (!isObject(obj)) return obj;

  if (map.has(obj)) return map.get(obj);

  let target = new obj.constructor();

  map.set(obj, target);

  for (let key in obj) {
    if (hasOWn(obj, key)) {
      target[key] = cloneDeep(obj[key], map);
    }
  }

  return target;
}
