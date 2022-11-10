import { Fab, Icon, Image, Spinner, Text, View } from "native-base";
import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "../../values/colors";
import { SellableItemCard } from "./SellableItemCard";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import {
  useNavigation,
  useRoute,
  use,
  useNavigationState,
} from "@react-navigation/native";
import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import { collection, orderBy, query } from "firebase/firestore";
import { firestore, productsCollection } from "../../firebase";
import { userUserStore } from "../../stores/UserStore";
import { useI18n } from "../../components/I18nProvider";
import { productConverter } from "../../models/product";
export function SellerHome() {
  const { user } = userUserStore();
  const { t } = useI18n();
  const [products, isFetchingProducts, fetchProductsError] = useCollectionData(
    query(
      productsCollection(user.id).withConverter(productConverter),
      orderBy("createdAt", "asc")
    )
  );
  const navigation = useNavigation();
  const [showFab, setShowFab] = useState(false);
  function onFabPress() {
    navigation.navigate("ProductForm");
  }
  useEffect(() => {
    navigation.addListener("state", ({ data }) => {
      setShowFab(data.state.routeNames[data.state.index] === "Home");
    });
  }, []);
  return (
    <View style={styles.container}>
      {isFetchingProducts ? (
        <Spinner />
      ) : fetchProductsError ? (
        <Text>{fetchProductsError.message}</Text>
      ) : products?.length === 0 ? (
        <Text>{t("no_products_found")}</Text>
      ) : (
        products?.map((product) => <SellableItemCard product={product} />)
      )}
      {showFab && (
        <Fab
          onPress={onFabPress}
          label={<Text color="primary.50">Producto</Text>}
          backgroundColor="primary.800"
          color="red.500"
          icon={<Icon color="primary.50" as={FontAwesome} name="plus" />}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
});
