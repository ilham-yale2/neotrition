<template>
    <div class="action-table">
        <div class="action-buttons">
            <button
                v-for="action in enabledActions"
                :key="action.value"
                :class="['action-btn', action.value]"
                @click="handleAction(action.value)"
                :title="action.label"
            >
                <component :is="action.icon" class="w-5 h-5" />
                <span v-if="showLabels">{{ action.label }}</span>
            </button>
        </div>
    </div>
</template>

<script>
import { Download, Eye, Pencil, Printer, Trash } from 'lucide-vue-next';

export default {
    name: 'ActionTable',
    props: {
        // Available actions to be displayed
        actions: {
            type: Array,
            default: () => ['view', 'edit', 'delete']
        },
        // Row ID for identifying which row triggered the action
        rowId: {
            type: [String, Number],
            required: true
        },
        // Option to show text labels alongside icons
        showLabels: {
            type: Boolean,
            default: false
        },
        // Custom icon classes (for overriding defaults)
        customIcons: {
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        // Define all available actions with their properties
        availableActions() {
            return {
                view: {
                    value: 'view',
                    label: 'View',
                    icon: this.customIcons.view || Eye
                },
                edit: {
                    value: 'edit',
                    label: 'Edit',
                    icon: this.customIcons.edit || Pencil
                },
                delete: {
                    value: 'delete',
                    label: 'Delete',
                    icon: this.customIcons.delete || Trash
                },
                download: {
                    value: 'download',
                    label: 'Download',
                    icon: this.customIcons.download || Download
                },
                print: {
                    value: 'print',
                    label: 'Print',
                    icon: this.customIcons.print || Printer
                }
            };
        },
        // Filter enabled actions based on props
        enabledActions() {
            return this.actions.map(action => {
                if (typeof action === 'string') {
                    return this.availableActions[action];
                }
                return action;
            }).filter(Boolean);
        }
    },
    methods: {
        handleAction(actionType) {
            // Emit the action event with action type and row information
            this.$emit('action', {
                type: actionType,
                rowId: this.rowId,
            });
        }
    }
}
</script>

<style scoped>
.action-table {
    display: inline-flex;
    align-items: center;
}

.action-buttons {
    display: flex;
    gap: 8px;
}

.action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 32px;
    border-radius: 4px;
    border: none;
    padding: 4px 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: white;
    font-size: 14px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-btn i {
    font-size: 1rem;
}

.action-btn span {
    margin-left: 4px;
}

.action-btn.view {
    background-color: #3498db;
}

.action-btn.view:hover {
    background-color: #2980b9;
}

.action-btn.edit {
    background-color: #f39c12;
}

.action-btn.edit:hover {
    background-color: #d35400;
}

.action-btn.delete {
    background-color: #e74c3c;
}

.action-btn.delete:hover {
    background-color: #c0392b;
}

.action-btn.download {
    background-color: #27ae60;
}

.action-btn.download:hover {
    background-color: #2ecc71;
}

.action-btn.print {
    background-color: #8e44ad;
}

.action-btn.print:hover {
    background-color: #9b59b6;
}
</style>
