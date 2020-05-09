import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, TextInput} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

function TextInputBox({placeholder, value, setValue, onEndEditing}) {
  return (
    <TextInput
      style={styles.textInput}
      onChangeText={setValue}
      onEndEditing={onEndEditing}
      defaultValue={value}
      placeholder={placeholder}
      keyboardType="default"
      autoCapitalize="none"
    />
  );
}

function Edit({navigation, route}) {
  const [title, setTitle] = useState(null);
  const [author, setAuthor] = useState(null);
  const [isbn, setIsbn] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [link, setLink] = useState(null);
  const [cover, setCover] = useState(null);
  const [description, setDescription] = useState(null);
  const [toc, setToc] = useState(null);
  const [pubDate, setPubDate] = useState(null);
  const [categoryName, setCategoryName] = useState(null);
  useEffect(() => {
    //
  }, []);
  const onEndEditing = params => {
    console.log('onEndEditing', params);
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        <TextInputBox
          placeholder={'제목'}
          value={title}
          setValue={setTitle}
          onEndEditing={() => onEndEditing({title})}
        />
        <TextInputBox
          placeholder={'저자'}
          value={author}
          setValue={setAuthor}
          onEndEditing={onEndEditing}
        />
        <TextInputBox
          placeholder={'ISBN'}
          value={isbn}
          setValue={setIsbn}
          onEndEditing={onEndEditing}
        />
        <TextInputBox
          placeholder={'출판사'}
          value={publisher}
          setValue={setPublisher}
          onEndEditing={onEndEditing}
        />
        <TextInputBox
          placeholder={'링크'}
          value={link}
          setValue={setLink}
          onEndEditing={onEndEditing}
        />
        <TextInputBox
          placeholder={'커버 이미지 링크'}
          value={cover}
          setValue={setCover}
          onEndEditing={onEndEditing}
        />
        <TextInputBox
          placeholder={'주요 내용'}
          value={description}
          setValue={setDescription}
          onEndEditing={onEndEditing}
        />
        <TextInputBox
          placeholder={'목차'}
          value={toc}
          setValue={setToc}
          onEndEditing={onEndEditing}
        />
        <TextInputBox
          placeholder={'출판일: 2020/04'}
          value={pubDate}
          setValue={setPubDate}
          onEndEditing={onEndEditing}
        />
        <TextInputBox
          placeholder={'카테고리 이름: 레벨1>레벨2'}
          value={categoryName}
          setValue={setCategoryName}
          onEndEditing={onEndEditing}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    margin: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spacer: {
    paddingVertical: 5,
  },
  cover: {
    width: 100,
    height: 100,
  },
  bookInfo: {
    flexDirection: 'column',
    width: '70%',
    // marginHorizontal: 10,
    marginLeft: 10,
    // marginVertical: 10,
  },
  title: {
    fontSize: 18,
  },
  author: {
    color: 'darkslategrey',
  },
  category: {
    color: 'navy',
  },
  isbn: {
    color: 'darkslategrey',
  },
  sectionTitle: {
    fontSize: 18,
  },
  htmlContainer: {
    marginHorizontal: 20,
  },
});

export default Edit;
