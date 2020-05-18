export default class ListListener {
  constructor(callback) {
    this.callback = callback;
  }
  listener = (oldList, changes) => {
    console.log('ListListener changes', changes);
    if (changes.deletions.length > 0) {
      console.log('changes.deletions exists');
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
      console.log('changes.modifications exists');
      const newList = [...oldList];
      changes.insertions.forEach(index => {
        newList[index] = oldList[index];
      });
      this.callback && this.callback(newList);
    }
    if (changes.insertions.length > 0) {
      console.log('changes.insertions exists');
      const newList = [...oldList];
      changes.insertions.forEach(index => {
        newList[index] = oldList[index];
      });
      this.callback && this.callback(newList);
    }
  };
}
