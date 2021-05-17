/* Copyright Contributors to the Open Cluster Management project */

import { useMediaQuery } from '@material-ui/core'
import {
    Alert,
    AlertGroup,
    AlertVariant,
    Button,
    ButtonVariant,
    Dropdown,
    DropdownItem,
    DropdownSeparator,
    DropdownToggle,
    DropdownToggleCheckbox,
    KebabToggle,
    OverflowMenu,
    OverflowMenuContent,
    OverflowMenuControl,
    OverflowMenuDropdownItem,
    OverflowMenuGroup,
    OverflowMenuItem,
    Pagination,
    SearchInput,
    Stack,
    Toolbar,
    ToolbarContent,
    ToolbarGroup,
    ToolbarItem,
    ToolbarToggleGroup,
} from '@patternfly/react-core'
import FilterIcon from '@patternfly/react-icons/dist/js/icons/filter-icon'
import { IRow, Table, TableBody, TableHeader } from '@patternfly/react-table'
import React, { useCallback, useState } from 'react'
import { TableToolBarBreakpoints } from '../TableToolbarBreakpoints'
import { TableFilter, TableFilterProps } from '../TableFilter'

interface AlertInfo {
    variant: AlertVariant
    title: string
    message?: string
}

type TableItems<T> = Record<string, T>
type TableSelection<T> = Record<string, T>

// interface TableItemChange {

interface TableToolbarProps<T = unknown> {
    items: Record<string, unknown>[]
    search?: string
    setSearch?: (search: string) => void
    filters?: TableFilterProps[]
}

export const TableToolbar = (props: TableToolbarProps) => {
    const { items } = props

    const tableToolbarBreakpoints: TableToolBarBreakpoints = {
        selection: 'lg',
        filters: 'lg',
        overFlowMenu: 'lg',
        pagination: 'lg',
        paginationCompact: 'lg',
    }

    const [selected, setSelected] = useState<string[]>([])
    const [selectIsOpen, setSelectIsOpen] = useState(false)

    const [isExpanded, setIsExpanded] = useState(false)
    const toggleIsExpanded = useCallback(() => setIsExpanded((expanded) => !expanded), [])

    const [tableAlerts, setTableAlerts] = useState<AlertInfo[]>([])

    const [kebabIsOpen, setKebabIsOpen] = useState(false)
    const onKebabToggle = useCallback(() => setKebabIsOpen((open) => !open), [])

    const columns = ['Name', 'Status', 'Risk']

    const [rows, setRows] = useState<IRow[]>(
        items.map((item) => ({
            cells: [item.name, item.status, item.risk],
        }))
    )

    function onSelect(event, isSelected, rowId) {
        if (rowId === -1) {
            setRows(
                rows.map((row) => {
                    row.selected = isSelected
                    return row
                })
            )
        } else {
            setRows((rows) => {
                const newRows = [...rows]
                newRows[rowId].selected = isSelected
                return newRows
            })
        }
    }

    const TableSelectionDropdown = () => (
        <Dropdown
            toggle={
                <DropdownToggle
                    splitButtonItems={[
                        <DropdownToggleCheckbox
                            id="1"
                            key="split-checkbox"
                            aria-label="Select all"
                            isChecked={selected.length > 0}
                            onChange={() => {
                                if (selected.length > 0) {
                                    onSelect(undefined, false, -1)
                                    setSelected([])
                                } else {
                                    onSelect(undefined, true, -1)
                                    setSelected(new Array(items.length).fill(''))
                                }
                            }}
                        >
                            {Object.keys(selected).length == 0
                                ? null
                                : isLG
                                ? `${Object.keys(selected).length} selected`
                                : isSM
                                ? `${Object.keys(selected).length}`
                                : null}
                        </DropdownToggleCheckbox>,
                    ]}
                    onToggle={(isOpen) => setSelectIsOpen(isOpen)}
                />
            }
            isOpen={selectIsOpen}
            dropdownItems={[
                <DropdownItem
                    key="none"
                    onClick={() => {
                        setSelected([])
                        setSelectIsOpen(false)
                        onSelect(undefined, false, -1)
                    }}
                >
                    Select none
                </DropdownItem>,
                <DropdownItem
                    key="page"
                    onClick={() => {
                        setSelected(new Array(items.length).fill(''))
                        setSelectIsOpen(false)
                        onSelect(undefined, true, -1)
                    }}
                >
                    Select page items
                </DropdownItem>,
                <DropdownItem
                    key="all"
                    onClick={() => {
                        setSelected(new Array(items.length).fill(''))
                        setSelectIsOpen(false)
                        onSelect(undefined, true, -1)
                    }}
                >
                    {`Select all ${items.length} items`}
                </DropdownItem>,
            ]}
        />
    )
    const isXXL = useMediaQuery('(min-width: 1400px)', { noSsr: true })
    const isXL = useMediaQuery('(min-width: 1200px)', { noSsr: true })
    const isLG = useMediaQuery('(min-width: 992px)', { noSsr: true })
    const isMD = useMediaQuery('(min-width: 768px)', { noSsr: true })
    const isSM = useMediaQuery('(min-width: 576px)', { noSsr: true })
    const isXS = useMediaQuery('(max-width: 576px)', { noSsr: true })

    const clearAllFilters = useCallback(() => {
        props.filters?.forEach((filter) => filter.setSelections(() => []))
    }, [props.filters])

    return (
        <Stack hasGutter>
            {tableAlerts.length > 0 && (
                <AlertGroup>
                    {tableAlerts.map((alert, index) => (
                        <Alert key={index} {...alert} isInline>
                            {alert.message}
                        </Alert>
                    ))}
                </AlertGroup>
            )}
            <Toolbar
                isExpanded={isExpanded}
                toggleIsExpanded={toggleIsExpanded}
                inset={{ md: 'insetNone' }}
                style={{ paddingTop: tableAlerts.length === 0 ? 0 : undefined }}
                clearAllFilters={clearAllFilters}
            >
                <ToolbarContent>
                    <ToolbarGroup variant="button-group">
                        <ToolbarItem>
                            <TableSelectionDropdown />
                        </ToolbarItem>
                        {selected.length !== 0 && (
                            <ToolbarItem>
                                <Dropdown
                                    toggle={
                                        <DropdownToggle id="toggle-id" isPrimary>
                                            Actions
                                        </DropdownToggle>
                                    }
                                    dropdownItems={[]}
                                ></Dropdown>
                            </ToolbarItem>
                        )}
                    </ToolbarGroup>

                    <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint={tableToolbarBreakpoints.filters}>
                        {props.setSearch && (
                            <ToolbarItem variant="search-filter">
                                <SearchInput
                                    placeholder="Search"
                                    value={props.search}
                                    onChange={props.setSearch}
                                    // onClear={this.onClear}
                                    // resultsCount={`${this.state.currentResult} / ${this.state.resultsCount}`}
                                />
                            </ToolbarItem>
                        )}
                        {props.filters && (
                            <ToolbarGroup variant="filter-group">
                                {props.filters.map((filter) => (
                                    <TableFilter key={filter.label} {...filter} />
                                ))}
                            </ToolbarGroup>
                        )}
                    </ToolbarToggleGroup>

                    <ToolbarItem variant="overflow-menu">
                        <OverflowMenu breakpoint={tableToolbarBreakpoints.overFlowMenu}>
                            <OverflowMenuContent>
                                <OverflowMenuGroup groupType="button">
                                    <OverflowMenuItem>
                                        <Button
                                            variant={selected.length ? ButtonVariant.secondary : ButtonVariant.primary}
                                        >
                                            Primary
                                        </Button>
                                    </OverflowMenuItem>
                                    <OverflowMenuItem>
                                        <Button
                                            variant={
                                                selected.length ? ButtonVariant.secondary : ButtonVariant.secondary
                                            }
                                        >
                                            Secondary
                                        </Button>
                                    </OverflowMenuItem>
                                </OverflowMenuGroup>
                            </OverflowMenuContent>
                            <OverflowMenuControl hasAdditionalOptions>
                                <Dropdown
                                    toggle={<KebabToggle onToggle={onKebabToggle} />}
                                    isOpen={kebabIsOpen}
                                    isPlain
                                    dropdownItems={[
                                        <OverflowMenuDropdownItem key="none" isShared>
                                            Create
                                        </OverflowMenuDropdownItem>,
                                        <OverflowMenuDropdownItem key="none" isShared>
                                            Import
                                        </OverflowMenuDropdownItem>,
                                        <OverflowMenuDropdownItem key="none">Delete</OverflowMenuDropdownItem>,
                                        <OverflowMenuDropdownItem key="none">Detach</OverflowMenuDropdownItem>,
                                        <DropdownSeparator key="1" />,
                                        <OverflowMenuDropdownItem
                                            key="none"
                                            onClick={() => {
                                                setTableAlerts((alerts) => {
                                                    const copy = [...alerts]
                                                    copy.push({
                                                        variant: AlertVariant.warning,
                                                        title: 'Table alert example',
                                                        message: 'Table alert message example.',
                                                    })
                                                    return copy
                                                })
                                            }}
                                        >
                                            Table alert
                                        </OverflowMenuDropdownItem>,
                                        <DropdownSeparator key="1" />,
                                        <OverflowMenuDropdownItem
                                            key="none"
                                            // onClick={() => setIsCompact(!isCompact)}
                                        >
                                            Toggle table compact
                                        </OverflowMenuDropdownItem>,
                                        <OverflowMenuDropdownItem
                                            key="none"
                                            // onClick={() => sethHasBorders(!hasBorders)}
                                        >
                                            Toggle table borders
                                        </OverflowMenuDropdownItem>,
                                    ]}
                                />
                            </OverflowMenuControl>
                        </OverflowMenu>
                    </ToolbarItem>

                    {isXL && (
                        <ToolbarItem variant="pagination">
                            <Pagination
                                variant="top"
                                itemCount={items.length}
                                isCompact={!isXXL}
                                // perPage={this.state.perPage}
                                // page={this.state.page}
                                // onSetPage={this.onSetPage}
                                // widgetId="pagination-options-menu-top"
                                // onPerPageSelect={this.onPerPageSelect}
                            />
                        </ToolbarItem>
                    )}
                </ToolbarContent>
            </Toolbar>
            <Table
                // variant={isCompact ? 'compact' : null}
                // borders={hasBorders}
                cells={columns}
                rows={rows}
                isStickyHeader
                onSelect={onSelect}
                canSelectAll={false}
            >
                <TableHeader />
                <TableBody />
            </Table>
            <Pagination
                variant="bottom"
                itemCount={items.length}
                perPage={10}
                page={1}
                // isSticky={!isMD}
                // onSetPage={this.onSetPage}
                // widgetId="pagination-options-menu-top"
                // onPerPageSelect={this.onPerPageSelect}
                // style={{ paddingBottom: 0 }}
                style={{ paddingTop: 0, paddingBottom: 0 }}
            />
        </Stack>
    )
}