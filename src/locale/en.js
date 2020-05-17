export default {
  Main: {
    title: 'Book Lover',
    searchBarPlaceholder: 'Title, author',
    ActionButton: {
      barcodeSearch: 'Search by bardcode',
      titleSearch: 'Search with title',
      editManually: 'Edit manually',
    },
  },
  BarcodeAdd: {
    title: 'Add by Barcode',
  },
  SearchAdd: {
    title: 'Add by Search',
  },
  Detail: {
    title: 'Detail',
  },
  Setting: {
    title: 'Setting',
    apiSourceLabel: 'Search API',
    Button: {
      backup: ' Backup, restore data',
      import: ' Import ISBN file data',
      delete: ' Delete all database data',
    },
    DeleteAlert: {
      title: 'DELETE',
      message: 'Are you sure to delete all database data?',
    },
  },
  Backup: {
    title: 'Backup, restore data',
    fileNameEmptyError: 'The backup file name is empty.',
    Input: {
      backup: 'Backup File',
      restore: 'Restore File',
    },
    Button: {
      backup: ' Backup data',
      restore: ' Restore data',
    },
    Toast: {
      restoreNoyReady:
        'You did not specify the restore file.\nPleae check it out again.',
      writeOk: 'To write backup file is done',
      writeFail: 'To write backup file is failed',
      restoreOk: 'To restore backup file is done',
      restoreFail: 'To restore backup file is failed',
      wrongFile:
        'There is no file or wrong format.\nPlease check it out again.',
    },
  },
  ImportIsbn: {
    title: 'Import ISBN file data',
  },
  CategoryBar: {
    top: 'TOTAL',
  },
  HeaderMenu: {
    title: 'Sort by title',
    titleReverse: 'Sort by title reverse',
    author: 'Sort by author',
    authorReverse: 'Sort by author reverse',
    date: 'Sort by date',
    dateReverse: 'Sort by date reverse',
  },
  Button: {
    login: 'Login',
    logout: 'Logout',
    ok: 'OK',
    cancel: 'Cancel',
    open: 'Open',
    new: 'New',
  },
  Language: {
    label: 'Language choice',
  },
};
