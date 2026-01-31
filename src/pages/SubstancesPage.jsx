
import React from 'react';
import { SubstancesTable } from '@/components/experiment/SubstancesTable';
import { LabLogo } from '@/components/LabLogo';
import { MoleculeDecoration } from '@/components/MoleculeDecoration';

const SubstancesPage = () => {
    return (
        <div className="min-h-screen bg-background lab-pattern relative overflow-hidden">
            <MoleculeDecoration />

            {/* Subtle grid overlay */}
            <div className="absolute inset-0 lab-grid opacity-30" />

            {/* Main content */}
            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Header */}
                <header className="p-6 md:p-8 flex items-center justify-between">
                    <LabLogo size="md" />
                </header>

                <main className="container mx-auto px-6 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold font-display">Chemical Substances</h1>
                        <p className="text-muted-foreground mt-2">Available acids and bases for experimentation.</p>
                    </div>
                    <div className="bg-card rounded-lg border shadow-sm p-6">
                        <SubstancesTable />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SubstancesPage;
