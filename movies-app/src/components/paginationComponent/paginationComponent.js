import { Component } from 'react'
import { Pagination } from 'antd'

export default class PaginationComponent extends Component {
  render() {
    const { currentPage, nextPage, total } = this.props
    return (
      <Pagination
        defaultPageSize={20}
        total={total}
        defaultCurrent={currentPage}
        onChange={nextPage}
        hideOnSinglePage={true}
        showSizeChanger={false}
      />
    )
  }
}