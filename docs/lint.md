# Typescript Lint

## 组件命名风格

目录需要做统一出口，这种“默认导出 + barrel 命名再导出”的模式

1. 使用箭头函数定义组件，保留组件名
2. 组件名首字母大写，驼峰命名法
3. 目录需要统一出口，例如 `useUsers` 目录下需要有 `index.ts` 导出 `useUsers` 函数


### 关于函数提升的问题

为了避免函数提升的问题，建议使用箭头函数定义组件，保留组件名。

```typescript
// 报错
console.log(add(1, 2))

const add = (a: number, b: number) => {
  return a + b;
}
```

```typescript
// 函数声明会被提升，能正常运行
console.log(add(1, 2))

function add(a: number, b: number) {
  return a + b;
}
```

