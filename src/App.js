import React from "react";
import { Table, Input, Pagination } from "antd";
import "antd/es/table/style/css"; // for css
import "antd/es/input/style/css"; // for css
import axios from "axios";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      searchText: "",
      data: [],
      filters: {
        pageNumber: 1,
        whereClause: {}
      },
      totalCounts: 0
    };
    this.fields = ["author", "message", "branch_ref", "project_name"];
  }

  getRecords = () => {
    axios.post("/api/get_records", this.state.filters).then(res => {
      const { data } = res;
      const { records, totalCounts } = data;
      if (Array.isArray(records) && records.length >= 0) {
        this.setState({
          totalCounts,
          data: records.map(x => {
            return { key: x.id, ...x };
          })
        });
      }
    });
  };

  componentDidMount() {
    this.getRecords();
  }

  handleFilterChange = (e, field) => {
    if(e) {
      // const { filters } = this.state;
      const { whereClause } = this.state.filters;
      if(!e.target.value) {
        delete whereClause[field]
      } else {
        whereClause[field] = e.target.value
        // filters.whereClause = [`${field} like ?%${e.target.value}%`]
      }
      this.setState(this.state, () => {
        this.getRecords();
      });
    }
  };
  handlePageChange = (page, _) => {
    this.state.filters.pageNumber = page;
    this.setState(this.state, () => {
      this.getRecords();
    });
  };

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  render() {
    const columns = [
      {
        title: "Created At",
        dataIndex: "created_at",
        key: "created_at",
        width: "20%"
      },

      {
        title: "Project Name",
        dataIndex: "project_name",
        key: "project_name",
        width: "10%"
      },

      {
        title: "Branch",
        dataIndex: "branch_ref",
        key: "branch_ref",
        width: "10%"
      },
      {
        title: "Author",
        dataIndex: "author",
        key: "author",
        width: "15%"
      },
      {
        title: "Message",
        dataIndex: "message",
        key: "message"
      }
    ];
    return (
      <div>
        <div>
          {this.fields.map(field => (
            <Input
              addonBefore={field}
              placeholder={`Search ${field}`}
              onChange={e => this.handleFilterChange(e, field)}
            />
          ))}
        </div>
        <Table
          columns={columns}
          dataSource={this.state.data}
          pagination={false}
        />
        ;
        <Pagination
          defaultCurrent={1}
          total={this.state.totalCounts}
          onChange={this.handlePageChange}
        />
      </div>
    );
  }
}
