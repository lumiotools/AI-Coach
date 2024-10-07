import React from "react";

const AdminDashboardButton = ({
  userEmail,
}: {
  userEmail: string | undefined;
}) => {
  if (userEmail !== undefined && userEmail === "salunkhekunal594@gmail.com") {
    return (
      <div className="text-center p-4">
        <a
          href="https://admin-dashboard-jade-gamma.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#2F76FF] rounded-full px-4 py-2 flex self-stretch items-center justify-center cursor-pointer"
        >
          Admin Dashboard
        </a>
      </div>
    );
  }
  return null;
};

export default AdminDashboardButton;
