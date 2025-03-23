import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import {
  Text,
  useTheme,
  IconButton,
  Surface,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const ActivityDetailsScreen = ({ navigation, route }: any) => {
  const theme = useTheme();
  const { activity } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
          <Text style={styles.headerTitle}>{activity.title}</Text>
        </View>

        <View style={styles.content}>
          <Surface style={styles.card}>
            <LinearGradient
              colors={[activity.color, `${activity.color}80`]}
              style={styles.gradient}
            >
              <IconButton
                icon={activity.icon}
                size={48}
                iconColor="#fff"
                style={styles.icon}
              />
              <Text style={styles.title}>{activity.title}</Text>
              <Text style={styles.time}>{activity.time}</Text>
              {activity.duration && (
                <Text style={styles.duration}>{activity.duration}</Text>
              )}
            </LinearGradient>
          </Surface>

          {activity.notes && (
            <Surface style={[styles.card, styles.notesCard]}>
              <Text style={styles.notesTitle}>Megjegyzések</Text>
              <Text style={styles.notesText}>{activity.notes}</Text>
            </Surface>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  backButton: {
    margin: 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  content: {
    padding: 16,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradient: {
    padding: 24,
    alignItems: 'center',
  },
  icon: {
    margin: 0,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  time: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 4,
  },
  duration: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  notesCard: {
    marginTop: 16,
    padding: 16,
  },
  notesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  notesText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default ActivityDetailsScreen; 