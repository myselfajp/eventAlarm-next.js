"use client";

import React, { useState } from "react";
import FollowingsContent from "@/components/follow/FollowingsContent";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import Header from "@/components/Header";

const FollowingsPage = () => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState("month");

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden transition-colors duration-300">
      <LeftSidebar isOpen={leftSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onLeftSidebarToggle={() => setLeftSidebarOpen(!leftSidebarOpen)}
          onRightSidebarToggle={() => setRightSidebarOpen(!rightSidebarOpen)}
        />

        <div className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 space-y-6">
            <FollowingsContent />
          </div>
        </div>
      </div>

      <RightSidebar
        isOpen={rightSidebarOpen}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        calendarView={calendarView}
        setCalendarView={setCalendarView}
        events={[]}
      />
    </div>
  );
};

export default FollowingsPage;
