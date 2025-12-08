import React from 'react';
import useRole from '../../../hooks/useRole';
import LoadingSpinner from '../../../components/LoadingSpinner';
import AdminProfileSetting from './AdminProfileSetting';
import TutorProfileSetting from './TutorProfileSetting';
import StudentProfileSetting from './StudentProfileSetting';

const ProfileSetting = () => {
     const { role, roleLoading } = useRole();
    if (roleLoading) {
        return <LoadingSpinner></LoadingSpinner>
    }
    if (role === 'admin') {
        return <AdminProfileSetting></AdminProfileSetting>
    }
    else if (role === 'tutor') {
        return <TutorProfileSetting></TutorProfileSetting>
    }
    else {
        return <StudentProfileSetting></StudentProfileSetting>
    }
    
};

export default ProfileSetting;