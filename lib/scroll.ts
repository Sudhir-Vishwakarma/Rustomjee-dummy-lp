export function shouldShowStickyBar(scrollY: number, heroHeight: number): boolean {
  return scrollY > heroHeight;
}
