import React from 'react';

const ProfileSettings = () => {
    return (
        <div>
            <h1 className='text-3xl font-bold text-center mt-10'>Welcome to eTuitionBd Profile Settings Page</h1>
        </div>
    );
};

export default ProfileSettings;



//  // DELETE application (owner or admin)
//   const handleDelete = async (application) => {
//     const confirm = await Swal.fire({
//       title: "Delete application?",
//       text: "This will permanently remove the application.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, delete",
//     });
//     if (!confirm.isConfirmed) return;

//     try {
//       const res = await axiosSecure.delete(`/applications/${application._id}`);
//       const ok =
//         res?.data?.deletedCount > 0 ||
//         res?.data?.acknowledged ||
//         res?.data?.success;
//       if (ok) {
//         await refetch();
//         Swal.fire({ icon: "success", title: "Deleted", timer: 1200, showConfirmButton: false });
//       } else {
//         Swal.fire({ icon: "error", title: "Delete failed" });
//       }
//     } catch (err) {
//       console.error("Delete error", err);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: err?.response?.data?.message || err?.message || "Server error",
//       });
//     }
//   };