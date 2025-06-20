import {FlatList, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

//custom imports
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import {colors, styles} from '../../../themes';
import CHeader from '../../../components/common/CHeader';
import {moderateScale} from '../../../common/constants';
import ProductCard from '../../../components/homeComponent/ProductCard';
import {removeProductAction} from '../../../redux/action/favoritesAction';
import CText from '../../../components/common/CText';
import strings from '../../../i18n/strings';

export default function Favorites() {
  const favorites = useSelector(state => state.favorites);
  const dispatch = useDispatch();

  const [favoritesData, setFavoritesData] = useState(favorites);

  useEffect(() => {
    setFavoritesData(favorites);
  }, [favorites]);

  const onPressFavorite = item => {
    const updatedFavorites = favoritesData.filter(fav => fav.id !== item.id);
    setFavoritesData(updatedFavorites);
    dispatch(removeProductAction(item.id));
  };

  const renderItem = ({item}) => (
    <ProductCard
      item={item}
      onPressFavorite={() => onPressFavorite(item)}
      favoriteProducts={favorites}
    />
  );

  return (
    <CSafeAreaView style={localStyles.root}>
      <View style={localStyles.container}>
        <CHeader
          isHideBack={true}
          title={strings.favorites}
          style={{paddingHorizontal: 0}}
        />
        <FlatList
          data={favoritesData}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.justifyBetween}
          bounces={false}
          contentContainerStyle={localStyles.contentContainerStyle}
          ListEmptyComponent={
            <View style={localStyles.emptyContainer}>
              <Ionicons
                name="heart-dislike"
                size={moderateScale(40)}
                color={colors.grayScale3}
                style={{marginBottom: 10}}
              />
              <CText type="m20" color={colors.grayScale5}>
                {strings.noFavoritesFound}
              </CText>
            </View>
          }
        />
      </View>
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  root: {
    ...styles.flex,
    backgroundColor: colors.white,
  },
  contentContainerStyle: {
    gap: moderateScale(10),
    ...styles.mv10,
    ...styles.flexGrow1,
    paddingBottom: moderateScale(100),
  },
  container: {
    ...styles.ph20,
    ...styles.pt20,
    ...styles.flex,
  },
  emptyContainer: {
    ...styles.flexCenter,
  },
});
