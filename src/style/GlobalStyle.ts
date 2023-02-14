import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyle = createGlobalStyle`
  ${reset}
  .ant-upload-span .ant-upload-list-item-name {
    cursor: pointer;
  }
  .ant-upload-span .ant-upload-list-item-name:hover {
    color: #40a9ff;
  }

  body {
    font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI',
      'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
      sans-serif;
    box-sizing: border-box;
}
.ant-layout-sider-children{
  position: fixed;
  width: 200px;
}

  a {
    color: inherit;
    text-decoration: none;
  }

  :disabled {
    cursor: not-allowed;
  }

.ant-modal-content{
    border-radius:20px;
  }
  .ant-modal-header {
    border-top-left-radius:20px;
    border-top-right-radius:20px;
  }
  .ant-modal-footer{
    display:flex;
    justify-content:center;
  }
  .ant-upload-list-picture-card-container{
    width:55px;
    height:55px;
    margin-bottom:0px;

  }
  .ant-upload.ant-upload-select-picture-card{
    width:55px;
    height:55px;
    border-width:2px;
    margin-bottom:0px;
    span{
      font-size:11px;
      font-weight:bold;
    }

    :hover{
      border-color:#1d39c4;
    }
  }

  .ant-tag{
    border-radius:10px;
  }

 .ant-tag.site-tag-plus{
    border:none;
    color: #1d39c4;
    background-color:transparent;
    :hover{
        border-color:#1d39c4;
      }
  }

  .ant-upload > .ant-btn.ant-btn-default{
    border:2px dashed lightgrey;  
    :hover{
        border-color:#1d39c4;
      }
  }

  .ant-table-thead > tr > th{
      text-align:center;
  }
  .ant-table-cell{
      text-align:center;
      vertical-align:middle;
  }
  .ant-table-thead > tr > th, .ant-table-tbody > tr > td, .ant-table tfoot > tr > th, .ant-table tfoot > tr > td{
      padding:5px;
  }

  .ant-upload-list-picture .ant-upload-list-item, .ant-upload-list-picture-card .ant-upload-list-item{
    padding:0px;
  }

  .ant-upload > span{
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    width:100%;
    color: #1d39c4;
  }

  .ant-table-row{
    :hover{
      cursor:pointer;
    }
  }

  .ant-input {
    border-radius:10px;
  }
  .ant-input-affix-wrapper{
    border-radius:10px;
  }
  .ant-select:not(.ant-select-customize-input) .ant-select-selector {
    border-radius:10px;
  }

`;

export default GlobalStyle;
