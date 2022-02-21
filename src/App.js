import React from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css"
//Explore more Monday React Components here: https://style.monday.com/
import AttentionBox from "monday-ui-react-core/dist/AttentionBox.js"

const monday = mondaySdk();

class App extends React.Component {
  constructor(props) {
    super(props);

    // Default state
    this.state = {
      settings: {},
      name: "",
      boardData: null,
    };
  }

  componentDidMount() {
    monday.listen("settings", res => {
      this.setState({ settings: res.data });
    });
    monday.listen("context", res => {
      this.setState({ context: res.data });
      console.log(res.data);
      monday.api(`query ($boardIds: [Int]) {
        boards(ids: $boardIds) {
          name
          groups {
            title
          }
          items {
            name
          }
        }
      }
      `,
        { variables: { boardIds: this.state.context.boardIds } }
      )
        .then(res => {
          this.setState({ boardData: res.data });
        });
    })
  }

  render() {
    return (
      <div
        className="App"
        style={{ background: this.state.settings.background }}
      >
        <AttentionBox
          title={this.state.settings.attentionBoxTitle || "Hello monday.apps"}
          text={this.state.settings.attentionBoxMessage || "You should be able to edit the info that appears here using the fields you've set up previously in the View settings :) "}
          type={this.state.settings.attentionBoxType || "success"}
        />
        {/* {JSON.stringify(this.state.boardData, null, 2)} */}
        <div>
          {this.state.boardData == null ? <button>refresh</button> : this.state.boardData.boards.map((board) =>
            <div
              style={
                {
                  border: '2px solid red',
                  title: board.name,
                }
              }
            >
              <button>{board.name}</button>
              {board.groups.map((group) =>
                <div
                  style={
                    {
                      border: '2px solid green',
                      title: board.name,
                    }
                  }
                >
                  <button>{group.title}</button>
                </div>
              )}
              {board.items.map((item) =>
                <div
                  style={
                    {
                      border: '2px solid blue',
                      title: board.name,
                    }
                  }
                >
                  <button>{item.name}</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}


export default App;
