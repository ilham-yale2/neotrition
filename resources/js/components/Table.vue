<script setup lang="ts">
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table/index';
import { router } from '@inertiajs/vue3';
import {
    Pagination,
    PaginationEllipsis,
    PaginationFirst,
    PaginationLast,
    PaginationList,
    PaginationListItem,
    PaginationNext,
    PaginationPrev,
} from './ui/pagination';
import { Button } from './ui/button';

export type TableHeaderType = {
    key: string;
    label: string;
    render?: (value: any, index?: number) => any;
};

interface TableProps {
    headers: TableHeaderType[];
    data: any[];
    caption?: string;
    pagination?: {
        total: number;
        perPage: number;
        currentPage: number;
        lastPage: number;
    };
    onPaginate?: (page: number) => void;
}

const props = withDefaults(defineProps<TableProps>(), {
    headers: () => [],
});

const goToPage = (page: number) => {
    router.get(window.location.pathname, { page }, { preserveState: true, preserveScroll: true });
};
</script>

<template>
    <Table>
        <TableCaption v-if="caption">{{ caption }}</TableCaption>
        <TableHeader>
            <TableRow>
                <TableHead v-for="header in headers" :key="header.key">
                    {{ header.label }}
                </TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <template v-if="data && data.length > 0">
                <TableRow v-for="(item, index) in data" :key="index">
                    <TableCell v-for="header in headers" :key="`${index}-${header.key}`">
                        {{ !header.render ? item?.[header.key] : '' }}
                        <component v-if="header.render" :is="header.render(item, index)" />
                    </TableCell>
                </TableRow>
            </template>
            <template v-else>
                <TableRow>
                    <TableCell :colspan="headers.length" class="text-center">No data available</TableCell>
                </TableRow>
            </template>
        </TableBody>
    </Table>

    <div v-if="props.pagination" class="flex justify-end mt-4">
        <Pagination v-slot="{ page }" :items-per-page="props.pagination.perPage" :total="props.pagination.total" :sibling-count="1" show-edges :default-page="props.pagination.currentPage">
            <PaginationList v-slot="{ items }" class="flex items-center gap-1">
                <PaginationFirst @click="goToPage(1)" />
                <PaginationPrev @click="props.pagination.currentPage > 1 ? goToPage(props.pagination.currentPage - 1) : null" />

                <template v-for="(item, index) in items">
                    <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
                        <Button @click="goToPage(item.value)" class="w-10 h-10 p-0" :variant="item.value === page ? 'default' : 'outline'">
                            {{ item.value }}
                        </Button>
                    </PaginationListItem>
                    <PaginationEllipsis v-else :key="item.type" :index="index" />
                </template>

                <PaginationNext @click="props.pagination.currentPage < props.pagination.lastPage ? goToPage(props.pagination.currentPage + 1) : null" />
                <PaginationLast @click="goToPage(props.pagination.lastPage)" />
            </PaginationList>
        </Pagination>
    </div>
</template>
