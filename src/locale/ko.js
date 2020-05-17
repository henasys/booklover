export default {
  Main: {
    title: '책사랑꾼',
    searchBarPlaceholder: '제목, 저자',
    ActionButton: {
      barcodeSearch: '바코드 검색',
      titleSearch: '제목, 저자 검색',
      editManually: '직접 입력',
    },
  },
  BarcodeAdd: {
    title: '바코드 검색 추가',
  },
  SearchAdd: {
    title: '제목 검색 추가',
  },
  Detail: {
    title: '상세 정보',
  },
  Setting: {
    title: '설정',
    apiSourceLabel: '검색 API',
    ApiSourceItem: {
      // only ko, not need to en
      ALADIN: '알라딘',
      NAVER: '네이버',
    },
    Button: {
      backup: ' 데이터 백업, 복원',
      import: ' ISBN 파일 데이터 추가',
      delete: ' 데이터베이스 삭제',
    },
    DeleteAlert: {
      title: '삭제',
      message: '데이터베이스 전체 데이터를 삭제하시겠습니까?',
    },
  },
  Backup: {
    title: '데이터 백업, 복원',
    fileNameEmptyError: '백업 파일 이름이 비어있습니다.',
    Input: {
      backup: '백업 파일',
      restore: '복원 파일',
    },
    Button: {
      backup: ' 데이터 백업',
      restore: ' 데이터 복원',
    },
    Toast: {
      restoreNoyReady:
        '아직 복원 파일을 선택하지 않았습니다.\n다시 확인해주십시오.',
      writeOk: '백업 파일 저장 완료',
      writeFail: '백업 파일 저장 실패',
      restoreOk: '데이터 복원 완료',
      restoreFail: '데이터 복원 실패',
      wrongFile: '파일이 없거나 잘못된 형식입니다.\n다시 확인해주십시오.',
    },
  },
  ImportIsbn: {
    title: 'ISBN 파일 데이터 추가',
  },
  CategoryBar: {
    top: '전체',
  },
  HeaderMenu: {
    title: '제목 정렬',
    titleReverse: '제목 역순',
    author: '저자 정렬',
    authorReverse: '저자 역순',
    date: '입력일 정렬',
    dateReverse: '입력일 역순',
  },
  Button: {
    login: '로그인',
    logout: '로그아웃',
    ok: '확인',
    cancel: '취소',
    open: '열기',
    new: '새로 만들기',
  },
  Language: {
    label: '언어선택',
  },
};
