/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Input, Icon} from 'react-native-elements';
import Toast from 'react-native-simple-toast';

import Database from '../modules/database';
import LocaleContext from '../modules/LocaleContext';

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
  const {t} = React.useContext(LocaleContext);
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
      title: book ? t('Edit.titleEdit') : t('Edit.titleInput'),
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
      setTitleError(t('Edit.Error.required'));
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
      Toast.show(t('Edit.Toast.checkRequired'));
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
      const msg = `${t('Edit.Toast.writeOk')}: ${resultBook.title}`;
      console.log(msg);
      Toast.show(msg);
    };
    const errorCallback = e => {
      const msg = `${t('Edit.Toast.writeFail')}: ${e}`;
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
          placeholder={t('Edit.Placeholder.title')}
          value={title}
          setValue={setTitle}
          onEndEditing={() => onEndEditing({title})}
          errorMessage={titleError}
        />
        <TextInputBox
          placeholder={t('Edit.Placeholder.author')}
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
          placeholder={t('Edit.Placeholder.publisher')}
          value={publisher}
          setValue={setPublisher}
          onEndEditing={() => onEndEditing({publisher})}
        />
        <TextInputBox
          placeholder={t('Edit.Placeholder.link')}
          value={link}
          setValue={setLink}
          onEndEditing={() => onEndEditing({link})}
        />
        <TextInputBox
          placeholder={t('Edit.Placeholder.cover')}
          value={cover}
          setValue={setCover}
          onEndEditing={() => onEndEditing({cover})}
        />
        <TextInputBox
          placeholder={t('Edit.Placeholder.description')}
          value={description}
          setValue={setDescription}
          onEndEditing={() => onEndEditing({description})}
        />
        <TextInputBox
          placeholder={t('Edit.Placeholder.toc')}
          value={toc}
          setValue={setToc}
          onEndEditing={() => onEndEditing({toc})}
        />
        <TextInputBox
          placeholder={t('Edit.Placeholder.pubDate')}
          value={pubDate}
          setValue={setPubDate}
          onEndEditing={() => onEndEditing({pubDate})}
        />
        <TextInputBox
          placeholder={t('Edit.Placeholder.categoryName')}
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
