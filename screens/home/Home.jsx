import { useAuthStore } from "../../components/AuthProvider";
import { userUserStore } from "../../stores/UserStore";
import { useI18n } from "../../components/I18nProvider";
import { signOut } from "firebase/auth";
import { auth, firestore } from "../../firebase";
import { View, StyleSheet } from "react-native";
import {
  Box,
  Button,
  HamburgerIcon,
  HStack,
  Menu,
  Pressable,
  Stack,
  Text,
  useToast,
} from "native-base";
import { LangSelector } from "../../components/LangSelector";
import React from "react";

import { useCollection } from "react-firebase-hooks/firestore";
import { query, collection, setDoc, doc } from "firebase/firestore";
import UserCard from "./UserCard";
import { useNavigation } from "@react-navigation/native";
import { useVideoCallStore } from "../../stores/VideoCallStore";
import { BuyerHome } from "./BuyerHome";
import { SellerHome } from "./SellerHome";

export default function Home() {
  const { user } = useAuthStore();
  const userStore = userUserStore();
  const { t } = useI18n();
  const toast = useToast();
  const videoCallStore = useVideoCallStore();
  const navigation = useNavigation();
  const [usersSS, loadingUsers, fetchUsersError] = useCollection(
    query(collection(firestore, "users"))
  );
  const users = usersSS?.docs
    ?.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    ?.filter((user) => user.email !== userStore?.user?.email);
  return (
    <View>
      <Stack space={4}>
        <Stack px={5}>
          <Text style={styles.welcomeText}>
            {t("welcome")} {userStore.user.name}
          </Text>
          <Text mt={5}>{t("you_are_selling")}</Text>
        </Stack>
        {userStore?.user?.role === "buyer" ? <BuyerHome /> : <SellerHome />}
      </Stack>
    </View>
  );
}
const styles = StyleSheet.create({
  userCardsContainer: {
    display: "flex",
    flexDirection: "column",
  },
  welcomeText: {
    fontWeight: "500",
    fontSize: 20,
    marginTop: 30,
  },
});
