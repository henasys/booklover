export default class ListListener {
  constructor(callback, tag = '', printable = false) {
    this.callback = callback;
    this.tag = tag;
  }
  listener = (oldList, changes) => {
    // console.log('ListListener changes', this.tag, changes);
    if (changes.deletions.length > 0) {
      this.printable && console.log('changes.deletions exists', this.tag);
      const newList = [];
      for (let index = 0; index < oldList.length; index++) {
        const element = oldList[index];
        if (!changes.deletions.includes(index)) {
          newList.push(element);
        }
      }
      this.callback && this.callback(newList);
    }
    if (changes.modifications.length > 0) {
      this.printable && console.log('changes.modifications exists', this.tag);
      const newList = [...oldList];
      changes.insertions.forEach(index => {
        newList[index] = oldList[index];
      });
      this.callback && this.callback(newList);
    }
    if (changes.insertions.length > 0) {
      this.printable && console.log('changes.insertions exists', this.tag);
      const newList = [...oldList];
      changes.insertions.forEach(index => {
        newList[index] = oldList[index];
      });
      this.callback && this.callback(newList);
    }
  };
}
