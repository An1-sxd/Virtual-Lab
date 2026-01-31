
import React from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { substances } from '@/lib/substances';

export const SubstancesTable = () => {
    const { acids, bases, isLoading, isError } = substances();

    if (isLoading) {
        return <div className="p-4 text-center">Loading substances...</div>;
    }

    if (isError) {
        return <div className="p-4 text-center text-red-500">Error loading substances.</div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h3 className="mb-4 text-lg font-semibold">Acids</h3>
                <div className="rounded-md border">
                    <Table>
                        <TableCaption>List of available acids.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Formula</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Charge</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {acids.map((acid) => (
                                <TableRow key={acid.value}>
                                    <TableCell className="font-medium">{acid.value}</TableCell>
                                    <TableCell>{acid.label.split('(')[1].replace(')', '')}</TableCell>
                                    <TableCell className="capitalize">{acid.type}</TableCell>
                                    <TableCell>{acid.c_value}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div>
                <h3 className="mb-4 text-lg font-semibold">Bases</h3>
                <div className="rounded-md border">
                    <Table>
                        <TableCaption>List of available bases.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Formula</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Charge</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bases.map((base) => (
                                <TableRow key={base.value}>
                                    <TableCell className="font-medium">{base.value}</TableCell>
                                    <TableCell>{base.label.split('(')[1].replace(')', '')}</TableCell>
                                    <TableCell className="capitalize">{base.type}</TableCell>
                                    <TableCell>{base.c_value}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};
