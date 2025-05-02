declare module '*.css' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: { src: string };
  export default content;
}