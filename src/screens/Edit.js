/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Input, Icon} from 'react-native-elements';
import Toast from 'react-native-simple-toast';

import Database from '../modules/database';

function TextInputBox({
  placeholder,
  value,
  setValue,
  onEndEditing,
  errorMessage = null,
}) {
  const numberOfLines = value && value.length > 100 ? 5 : 1;
  return (
    <Input
      containerStyle={styles.textInputBox}
      style={styles.textInput}
      labelStyle={{fontSize: 14}}
      onChangeText={setValue}
      onEndEditing={onEndEditing}
      defaultValue={value}
      errorMessage={errorMessage}
      label={placeholder}
      keyboardType="default"
      autoCapitalize="none"
      multiline={true}
      numberOfLines={numberOfLines}
    />
  );
}

function Edit({navigation, route}) {
  const [realm, setRealm] = React.useState(null);
  const [book, setBook] = useState(null);
  const [title, setTitle] = useState(null);
  const [titleError, setTitleError] = useState(null);
  const [author, setAuthor] = useState(null);
  const [isbn, setIsbn] = useState(null);
  const [isbn13, setIsbn13] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [link, setLink] = useState(null);
  const [cover, setCover] = useState(null);
  const [description, setDescription] = useState(null);
  const [toc, setToc] = useState(null);
  const [pubDate, setPubDate] = useState(null);
  const [categoryName, setCategoryName] = useState(null);
  useEffect(() => {
    Database.open(_realm => {
      setRealm(_realm);
      // console.log('Database.open');
    });
    return () => {
      Database.close(realm);
      // console.log('Database.close');
    };
  }, []);
  useEffect(() => {
    const paramBook = route.params?.book;
    setBook(paramBook);
    if (!paramBook) {
      return;
    }
    setTitle(paramBook.title);
    setAuthor(paramBook.author);
    setIsbn(paramBook.isbn);
    setIsbn13(paramBook.isbn13);
    setPublisher(paramBook.publisher);
    setLink(paramBook.link);
    setCover(paramBook.cover);
    setDescription(paramBook.description);
    setToc(paramBook.toc);
    setPubDate(paramBook.pubDate);
    setCategoryName(paramBook.categoryName);
  }, []);
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: book ? '상세 정보 수정' : '직접 입력 추가',
      headerRight: () => (
        <View style={styles.menuContainer}>
          <Icon
            iconStyle={styles.menuItem}
            onPress={() => {
              saveBook();
            }}
            name="save"
            type="material"
          />
        </View>
      ),
    });
  }, [
    navigation,
    book,
    realm,
    title,
    author,
    isbn,
    isbn13,
    publisher,
    link,
    cover,
    description,
    toc,
    pubDate,
    categoryName,
  ]);
  const onEndEditing = params => {
    console.log('onEndEditing', params);
    checkInvalidParams();
  };
  const checkInvalidParams = () => {
    if (!title) {
      setTitleError('필수 항목입니다.');
      return true;
    } else {
      setTitleError(null);
      return false;
    }
  };
  const saveBook = () => {
    if (!realm) {
      console.log('no realm in saveBook');
      return;
    }
    console.log('title', title);
    if (checkInvalidParams()) {
      Toast.show('필수항목을 점검해주십시오.');
      return;
    }
    const item = {
      title,
      author,
      isbn,
      isbn13,
      publisher,
      link,
      cover,
      description,
      toc,
      pubDate,
      categoryName,
      id: book ? book.id : null,
      priceSales: book ? book.priceSales : null,
      priceStandard: book ? book.priceStandard : null,
      category: book ? book.category : null,
    };
    const callback = resultBook => {
      const msg = `저장 성공: ${resultBook.title}`;
      console.log(msg);
      Toast.show(msg);
    };
    const errorCallback = e => {
      const msg = `저장 오류: ${e}`;
      console.log(msg);
      console.log(e.stack);
      Toast.show(msg);
    };
    // console.log('before saveOrUpdateBook', item);
    Database.saveOrUpdateBook(realm, item)
      .then(resultBook => {
        callback(resultBook);
      })
      .catch(e => {
        errorCallback(e);
      });
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        <TextInputBox
          placeholder={'제목'}
          value={title}
          setValue={setTitle}
          onEndEditing={() => onEndEditing({title})}
          errorMessage={titleError}
        />
        <TextInputBox
          placeholder={'저자'}
          value={author}
          setValue={setAuthor}
          onEndEditing={() => onEndEditing({author})}
        />
        <TextInputBox
          placeholder={'ISBN'}
          value={isbn}
          setValue={setIsbn}
          onEndEditing={() => onEndEditing({isbn})}
        />
        <TextInputBox
          placeholder={'ISBN13'}
          value={isbn13}
          setValue={setIsbn13}
          onEndEditing={() => onEndEditing({isbn13})}
        />
        <TextInputBox
          placeholder={'출판사'}
          value={publisher}
          setValue={setPublisher}
          onEndEditing={() => onEndEditing({publisher})}
        />
        <TextInputBox
          placeholder={'링크'}
          value={link}
          setValue={setLink}
          onEndEditing={() => onEndEditing({link})}
        />
        <TextInputBox
          placeholder={'커버 이미지 링크'}
          value={cover}
          setValue={setCover}
          onEndEditing={() => onEndEditing({cover})}
        />
        <TextInputBox
          placeholder={'주요 내용'}
          value={description}
          setValue={setDescription}
          onEndEditing={() => onEndEditing({description})}
        />
        <TextInputBox
          placeholder={'목차'}
          value={toc}
          setValue={setToc}
          onEndEditing={() => onEndEditing({toc})}
        />
        <TextInputBox
          placeholder={'출판일: 2020-04'}
          value={pubDate}
          setValue={setPubDate}
          onEndEditing={() => onEndEditing({pubDate})}
        />
        <TextInputBox
          placeholder={'카테고리 이름: 레벨1>레벨2'}
          value={categoryName}
          setValue={setCategoryName}
          onEndEditing={() => onEndEditing({categoryName})}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuContainer: {
    flexDirection: 'row',
  },
  menuItem: {
    marginRight: 10,
  },
  contentContainer: {
    margin: 20,
  },
  textInputBox: {
    marginVertical: 5,
  },
});

export default Edit;
