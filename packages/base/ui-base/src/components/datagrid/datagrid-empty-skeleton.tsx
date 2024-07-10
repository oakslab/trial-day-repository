import { TableRow, Skeleton, Table, TableBody, TableCell } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

const DEFAULT_SKELETON_WIDTH = 48;
const SKELETON_HEIGHT = 40;
const SKELETON_ROWS = 4;

export const DatagridEmptySkeleton = ({
  columns,
}: {
  columns: readonly GridColDef[];
}) => (
  <Table>
    <TableBody>
      {Array(SKELETON_ROWS)
        .fill('')
        .map((_, i) => (
          <TableRow key={i}>
            {columns.map((column, i) => (
              <TableCell
                key={i}
                sx={{
                  border: 'none',
                  width: `${column.width || column.minWidth || DEFAULT_SKELETON_WIDTH}px`,
                }}
                align="left"
              >
                <Skeleton variant="text" height={SKELETON_HEIGHT} />
              </TableCell>
            ))}
          </TableRow>
        ))}
    </TableBody>
  </Table>
);
