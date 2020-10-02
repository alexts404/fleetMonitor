import { useTable, useFilters, useGlobalFilter, Row } from 'react-table';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ShipsState } from '../../types/redux';
import { DefaultColumnFilter } from '../DefaultColumnFilter/DefaultColumnFilter';
import { SelectColumnFilter } from '../SelectColumnFilter/SelectColumnFilter';

type ShipTableProps = {
  setRows;
};

const EmptyDiv: React.FC<unknown> = () => <div></div>;

function ShipTable({ setRows }: ShipTableProps) {
  const shipData = useSelector((state: ShipsState) => state.ships);

  const data = React.useMemo(() => shipData, [shipData]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Ship Name',
        accessor: 'shipName',
      },
      {
        Header: 'MMSI #',
        accessor: 'mmsi',
      },
      {
        Header: 'Ship Type',
        accessor: 'type',
        Filter: SelectColumnFilter,
        filter: 'includes',
      },
      {
        Header: 'Owner',
        accessor: 'owner',
        Filter: SelectColumnFilter,
        filter: 'includes',
      },
      {
        Header: 'Latitude',
        accessor: 'lat',
        Filter: <EmptyDiv />,
        filter: 'includes',
      },
      {
        Header: 'Longitude',
        accessor: 'lng',
        Filter: <EmptyDiv />,
        filter: 'includes',
      },
      {
        Header: 'updated',
        accessor: 'updated',
        Filter: <EmptyDiv />,
        filter: 'includes',
      },
    ],
    [],
  );

  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    [],
  );

  const filterTypes = React.useMemo(
    () => ({
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    [],
  );
  const tableInstance = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
    },
    useFilters,
    useGlobalFilter,
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  useEffect(() => {
    setRows(rows);
  }, [rows]);

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()} key="headers">
            {headerGroup.headers.map((column) => {
              return (
                <th
                  {...column.getHeaderProps()}
                  key={'header-' + column.Header}
                >
                  {column.render('Header')}
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} key={row.id}>
              {row.cells.map((cell) => {
                return (
                  <td
                    {...cell.getCellProps()}
                    key={'row' + cell.row.id + '-' + cell.column.Header}
                  >
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default React.memo(ShipTable);
