import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

//custom imports
import CLoader from '../../../components/common/CLoader';
import {moderateScale, screenWidth} from '../../../common/constants';
import CHeader from '../../../components/common/CHeader';
import {colors, styles} from '../../../themes';
import strings from '../../../i18n/strings';
import ProductCard from '../../../components/homeComponent/ProductCard';
import {useDispatch, useSelector} from 'react-redux';
import {
  addProductAction,
  removeProductAction,
} from '../../../redux/action/favoritesAction';
import CText from '../../../components/common/CText';
import {useLazyGetProductsQuery} from '../../../redux/api/productsApi';

export default function Home() {
  const [getProductsApi, {isFetching}] = useLazyGetProductsQuery();

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const favoriteProducts = useSelector(state => state.favorites);
  const dispatch = useDispatch();
  const limit = 10;

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    if (!(!hasMore || isFetching)) {
      try {
        const res = await getProductsApi({limit, skip}).unwrap();

        if (res.products.length < limit) {
          setHasMore(false);
        }

        const newList = [...products, ...res.products];
        setProducts(newList);
        setFiltered(newList);
        setSkip(prev => prev + limit);
      } catch (error) {
        console.error('Fetch error', error);
      }
    }
  };

  const onPressFavorite = val => {
    const alreadyFavorite = favoriteProducts.some(item => item.id === val.id);

    if (alreadyFavorite) {
      dispatch(removeProductAction(val.id));
    } else {
      const updatedVal = {
        ...val,
        isFavorite: true,
      };
      dispatch(addProductAction(updatedVal));
    }
  };

  const renderItem = ({item}) => (
    <ProductCard
      item={item}
      onPressFavorite={() => onPressFavorite(item)}
      favoriteProducts={favoriteProducts}
    />
  );

  const ListEmptyComponent = () => {
    return (
      <View style={styles.flex}>
        {!isFetching && (
          <View style={localStyles.emptyContainer}>
            <Ionicons
              name="alert-circle-outline"
              size={moderateScale(40)}
              color={colors.grayScale4}
              style={styles.mb10}
            />
            <CText>{strings.noProductFound}</CText>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={localStyles.root}>
      <>
        <View style={localStyles.container}>
          <CHeader
            isHideBack={true}
            title={strings.products}
            style={{paddingHorizontal: 0}}
          />
          <FlatList
            data={filtered}
            testID="product-list"
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            numColumns={2}
            onEndReached={getProducts}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.justifyBetween}
            bounces={false}
            contentContainerStyle={localStyles.contentContainerStyle}
            ListEmptyComponent={ListEmptyComponent}
            ListFooterComponent={
              isFetching && products.length > 0 ? (
                <ActivityIndicator
                  size="small"
                  color={colors.primary}
                  testID="footer-loader"
                />
              ) : null
            }
          />
        </View>
      </>
      {products.length === 0 && <CLoader />}
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  root: {
    ...styles.flex,
    backgroundColor: colors.white,
  },
  container: {
    ...styles.ph20,
    ...styles.pt20,
    ...styles.flex,
  },
  listMainContainer: {
    backgroundColor: colors.grayScale9,
    ...styles.ph15,
    ...styles.pv10,
    borderRadius: moderateScale(3),
    width: screenWidth / 2.3,
    ...styles.justifyBetween,
  },
  discountContainer: {
    backgroundColor: colors.lightRed,
    paddingVertical: moderateScale(2),
    ...styles.ph5,
    borderRadius: moderateScale(2),
  },
  image: {
    width: '100%',
    height: moderateScale(130),
    resizeMode: 'contain',
    ...styles.mb20,
    ...styles.mt10,
  },
  ratingContainer: {
    ...styles.rowStart,
    gap: moderateScale(5),
    marginVertical: moderateScale(5),
  },
  contentContainerStyle: {
    gap: moderateScale(10),
    ...styles.mv10,
    ...styles.flexGrow1,
    paddingBottom: moderateScale(100),
  },
  emptyContainer: {
    ...styles.flexCenter,
  },
});
