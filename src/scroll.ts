type Scroller = {
  scrollToOffset: (args: { offset: number; animated: boolean }) => void;
};

const scrollers = new Map<string, Scroller>();

export function registerScroll(name: string, scroller: Scroller | null) {
  if (scroller) scrollers.set(name, scroller);
  else scrollers.delete(name);
}

export function scrollToTop(name: string) {
  scrollers.get(name)?.scrollToOffset({ offset: 0, animated: true });
}
