"use client"

import React, { useState } from "react"
import Header from "./header"
import PersonalizedAIForm from "./PersonalizeAIForm"

export default function Main() {
    const [isFormOpen, setIsFormOpen] = useState(false)

    const handleOpenForm = () => setIsFormOpen(true)
    const handleCloseForm = () => setIsFormOpen(false)

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Header onOpenForm={handleOpenForm} />
            <PersonalizedAIForm isOpen={isFormOpen} onClose={handleCloseForm} />
        </div>
    )
}