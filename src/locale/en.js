export default {
  Main: {
    title: 'Book Lover',
    searchBarPlaceholder: 'Title, author',
    ActionButton: {
      barcodeSearch: 'Search by bardcode',
      titleSearch: 'Search with title',
      inputManually: 'Input manually',
    },
  },
  BarcodeAdd: {
    title: 'Add by Barcode',
    Error: {
      wrongIsbn: 'Wrong ISBN',
      alreadyAdded: 'Already added',
      search: 'Error to search',
    },
  },
  SearchAdd: {
    title: 'Add by Search',
    searchBarPlaceholder: 'Tile, author, ISBN',
    Error: {
      noResult: 'No search result',
      search: 'Error to search',
      add: 'Error to add ',
    },
  },
  Detail: {
    title: 'Detail',
    description: 'Description',
    toc: 'Table of Contents',
  },
  Edit: {
    titleEdit: 'Edit',
    titleInput: 'Input manually',
    Error: {
      required: 'This field is required.',
    },
    Toast: {
      checkRequired: 'Check the required field.',
      writeOk: 'Write done',
      writeFail: 'Write failed',
    },
    Placeholder: {
      title: 'Title',
      author: 'Author',
      publisher: 'Publisher',
      link: 'Book Link',
      cover: 'Book cover image link',
      description: 'Description',
      toc: 'Table of Contents',
      pubDate: 'published date: 2020-04',
      categoryName: 'Category name: Level1>Level2',
    },
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
    modalInitMessage: 'Total: %{total}',
    modalMessage: 'Total: %{total}, \nSuccess: %{success}, Failure: %{failure}',
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
    modalInitMessage: 'Total: %{total}',
    modalMessage:
      'Total: %{total} Success: %{success} \nDuplicated: %{duplicated} Failure: %{failure}',
    Input: {
      isbn: 'ISBN File',
    },
    Button: {
      isbn: 'Add by ISBN search',
    },
    Toast: {
      notReadyFile: 'You did not specify the file.\nPleae check it out again.',
      wrongFile: 'There is no file or wrong format.',
    },
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
  SwipeableRow: {
    actionTitle: 'Delete',
    alertTitle: 'Delete',
  },
  Button: {
    login: 'Login',
    logout: 'Logout',
    ok: 'OK',
    cancel: 'Cancel',
    open: 'Open',
    new: 'New',
    close: 'Close',
    restore: 'Restore',
  },
  Language: {
    label: 'Language choice',
  },
  Misc: {
    toastExitApplication: 'Press again to quit the application!',
  },
};
