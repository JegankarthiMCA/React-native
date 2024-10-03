// ProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    throw new Error('Authentication token not found');
                }
               
                const response = await axios.get('http://172.16.22.187:8080/api/auth/user', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setProfileData(response.data);
            } catch (error) {
                if (error.response) {
                    setError(error.response.data.message || 'Failed to load profile data');
                } else if (error.request) {
                    setError('No response from the server');
                } else {
                    setError(`Request error: ${error.message}`);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    if (loading) {
        return <Text style={styles.loadingText}>Loading profile...</Text>;
    }

    if (error) {
        return <Text style={styles.errorText}>{error}</Text>;
    }

    if (!profileData) {
        return <Text style={styles.noInfoText}>No profile information available</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Profile</Text>
            <Text style={styles.info}>Name: {profileData.username}</Text>
            <Text style={styles.info}>Email: {profileData.email}</Text>
            <Text style={styles.info}>Phone: {profileData.phoneNumber}</Text>
            {/* Add other profile fields as needed */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#34495e',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ecf0f1',
        textAlign: 'center',
        marginVertical: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#ffffff',
        paddingBottom: 10,
    },
    info: {
        fontSize: 16,
        color: '#ecf0f1',
        marginBottom: 10,
    },
    loadingText: {
        color: '#ecf0f1',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
    errorText: {
        color: '#e74c3c',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
    noInfoText: {
        color: '#ecf0f1',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
});
