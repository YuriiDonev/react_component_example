import React from 'react';
import GridWrapper from '~common/gridwrapper/GridWrapper';
import Input from '~common/form/Input';
import { GridUtil } from '~common/utils/grid.util';
import { KeyboardUtil } from '~common/utils/keyboard-events.util';
import { keyboardKeyNames } from '~common/constants/keyboard.constants';
import { DocumentsBundlingGridToolbar } from './DocumentsBundlingGridToolbar';
import { columnNames } from '../../../../constants/documents-grid.constants';
import { documentsBundlingGridSettings } from '../../constants/documents-bundling-grid.constants';
import { DocumentsBundlingGridUtil } from '../../utils/documents-bundling-grid.util';

export class DocumentsBundlingGrid extends React.Component {
  handleRowDragMove = _.debounce((event) => {
    const paginationFactor = GridUtil.calcPaginationFactor(this.pageNumber, this.pageSize);
    this.movableRow = {
      fromIndex: event.node.data.index,
      toIndex: paginationFactor + event.node.rowIndex,
    };
  }, 200);

  handleMouseUp = _.debounce(() => {
    if (this.movableRow) {
      const { onDocumentsOrderChange } = this.props;
      onDocumentsOrderChange(this.movableRow);
      this.movableRow = null;
    }
  }, 300);

  constructor(props) {
    super(props);
    this.movableRow = null;
    this.pageSize = 0;
    this.pageNumber = 0;
    this.state = {
      pageToPaginate: 0,
    };

    this.columnSettingsList = DocumentsBundlingGridUtil.addRowNumberRenderer(
      documentsBundlingGridSettings.documentsColumnSettingsList,
      this.renderRowNumberInput,
    );
  }

  componentDidMount() {
    window.addEventListener('mouseup', this.handleMouseUp);
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.handleMouseUp);
  }

  fetchRows = ({ pageNumber, pageSize }) => {
    const { getDocuments } = this.props;
    return getDocuments().then(({ rows, totalRowCount }) => {
      const paginatedRows = GridUtil.paginate(rows, pageSize, pageNumber);
      return {
        rows: GridUtil.addIndexToRows(paginatedRows, pageNumber, pageSize),
        totalRowCount,
      };
    });
  };

  handleGridUpdated = ({ pageSize, pageNumber, rows }) => {
    this.pageSize = pageSize;
    this.pageNumber = pageNumber;
    if (pageNumber > 1 && !rows.length) {
      this.setState({ pageToPaginate: pageNumber - 1 });
    }
  };

  handleCellClick = (event) => {
    const { data, colDef } = event;
    const { field } = colDef;
    if (field === columnNames.deleteItem) {
      const { onDocumentsDelete } = this.props;
      onDocumentsDelete(data);
    }
  };

  handleRowNumberChange = (prevRowNumber, nextRowNumber) => {
    const { onDocumentsOrderChange } = this.props;
    onDocumentsOrderChange({
      fromIndex: prevRowNumber - 1,
      toIndex: nextRowNumber - 1,
    });
  };

  renderRowNumberInput = ({ data }) => {
    const { index } = data;
    const name = `row-number-${index}`;
    const rowNumber = _.isNumber(index) ? index + 1 : '';

    return (
      <Input
        customClassName="document-row-number-input"
        type="number"
        name={name}
        defaultValue={rowNumber}
        onBlur={({ target }) => this.handleRowNumberChange(rowNumber, +target.value)}
        onKeyPress={KeyboardUtil.createKeyboardEventHandler(
          ({ target }) => target.blur(),
          [keyboardKeyNames.enter],
        )}
      />
    );
  };

  renderCustomToolbar = () => {
    const { onClose } = this.props;
    return (
      <DocumentsBundlingGridToolbar onClose={onClose} />
    );
  };

  render() {
    const { gridUpdateRequired } = this.props;
    const { pageToPaginate } = this.state;

    return (
      <div className="documents-bundling-grid">
        <GridWrapper
          suppressKeyboardEvent={documentsBundlingGridSettings.suppressKeyboardEvent}
          gridName={documentsBundlingGridSettings.gridName}
          columns={this.columnSettingsList}
          rowClassRules={documentsBundlingGridSettings.rowClassRules}
          rowSelection={documentsBundlingGridSettings.rowSelection}
          filteringOptions={documentsBundlingGridSettings.filteringOptions}
          showCustomFilters={documentsBundlingGridSettings.showCustomFilters}
          onCellClicked={this.handleCellClick}
          fetchRows={this.fetchRows}
          fetchRequired={gridUpdateRequired}
          renderCustomToolbar={this.renderCustomToolbar}
          onRowDragMove={this.handleRowDragMove}
          preventSaveUserSessionCurrentPage={documentsBundlingGridSettings.preventSaveUserSessionCurrentPage}
          rowDragManaged={documentsBundlingGridSettings.rowDragManaged}
          animateRows={documentsBundlingGridSettings.animateRows}
          pageToPaginate={pageToPaginate}
          onGridUpdated={this.handleGridUpdated}
        />
      </div>
    );
  }
}
