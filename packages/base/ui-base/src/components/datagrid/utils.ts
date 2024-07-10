const BOX_SHADOW_COLOR = 'rgba(0, 0, 0, 0.2)';
const BOX_SHADOW_SIZE = '10px';

const LEFT_SHADOW = `${BOX_SHADOW_SIZE} 0 ${BOX_SHADOW_SIZE} -${BOX_SHADOW_SIZE} ${BOX_SHADOW_COLOR}`;
const RIGHT_SHADOW = `-${BOX_SHADOW_SIZE} 0 ${BOX_SHADOW_SIZE} -${BOX_SHADOW_SIZE} ${BOX_SHADOW_COLOR}`;

const RIGHT_INSET_SHADOW = `inset ${RIGHT_SHADOW}`;
const LEFT_INSET_SHADOW = `inset ${LEFT_SHADOW}`;

export const applyShadowsToScroller = (virtualScroller: HTMLDivElement) => {
  // if inner content is scrollable to right - apply shadow to the right
  // if inner content is scrollable to left - apply shadow to the left
  // if inner content is scrollable to both sides - apply shadow to both sides
  const scrollableToLeft = virtualScroller.scrollLeft > 0;
  const scrollableToRight =
    virtualScroller.scrollLeft + virtualScroller.clientWidth <
    virtualScroller.scrollWidth;

  const pinnedColumns = virtualScroller.querySelector<HTMLDivElement>(
    '.MuiDataGrid-pinnedColumns.MuiDataGrid-pinnedColumns--left, .MuiDataGrid-pinnedColumns.MuiDataGrid-pinnedColumns--right',
  );

  if (scrollableToLeft && scrollableToRight) {
    if (pinnedColumns) {
      virtualScroller.style.boxShadow = RIGHT_INSET_SHADOW;
      pinnedColumns.style.boxShadow = pinnedColumns.classList.contains(
        'MuiDataGrid-pinnedColumns--left',
      )
        ? LEFT_SHADOW
        : RIGHT_SHADOW;
    } else {
      virtualScroller.style.boxShadow = `${LEFT_INSET_SHADOW}, ${RIGHT_INSET_SHADOW}`;
    }
  } else if (scrollableToLeft) {
    virtualScroller.style.boxShadow = LEFT_INSET_SHADOW;
    if (pinnedColumns) {
      pinnedColumns.style.boxShadow = pinnedColumns.classList.contains(
        'MuiDataGrid-pinnedColumns--left',
      )
        ? LEFT_SHADOW
        : 'none';
    }
  } else if (scrollableToRight) {
    virtualScroller.style.boxShadow = RIGHT_INSET_SHADOW;
    if (pinnedColumns) {
      pinnedColumns.style.boxShadow = pinnedColumns.classList.contains(
        'MuiDataGrid-pinnedColumns--right',
      )
        ? RIGHT_SHADOW
        : 'none';
    }
  }
};
