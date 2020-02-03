import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  PanResponder,
  PanResponderInstance,
  TouchableOpacity,
  Animated,
  TextInput,
  Button
} from "react-native";

import Modal from 'react-native-modal';

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


function immutableMove(arr, from, to) {
  return arr.reduce((prev, current, idx, self) => {
    if (from === to) {
      prev.push(current);
    }
    if (idx === from) {
      return prev;
    }
    if (from < to) {
      prev.push(current);
    }
    if (idx === to) {
      prev.push(self[from]);
    }
    if (from > to) {
      prev.push(current);
    }
    return prev;
  }, []);
}

const colorMap = {};

export default class Kanball extends React.Component {
  
  _renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );
  _renderModalContent = () => (
    <View style={styles.modalContent}>
      <Text>Nome</Text>
        <TextInput 
            placeholder='Nome'
            autoFocus={true}
            onChangeText={data => this.setState({ textInput_Holder: data })}
        />
         <TouchableOpacity onPress={this.joinData } activeOpacity={0.7} style={styles.button} >
 
          <Text> Adicionar itens na lista </Text>
 
        </TouchableOpacity>
        {this._renderButton('Fechar', () => this.setState({ visibleModal: null }))}
    </View>
  );

  _panResponder: PanResponderInstance;
  point = new Animated.ValueXY();
  currentY = 0;
  scrollOffset = 0;
  flatlistTopOffset = 0;
  rowHeight = 0;
  currentIdx = -1;
  active = false;

  constructor(props) {
    super(props)
    this.array = [{
      title:'Início'
    }
    ],
      this.state = {
      dragging: false,
      draggingIdx: -1,
      visibleModal: null,
      data: Array.from(Array(this.array.length), (_, i) => {
      colorMap[i] = getRandomColor();
      return i;
    })
   }
  
    
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!
        // gestureState.d{x,y} will be set to zero now
        this.currentIdx = this.yToIndex(gestureState.y0);
        this.currentY = gestureState.y0;
        Animated.event([{ y: this.point.y }])({
          y: gestureState.y0 - this.rowHeight / 2
        });
        this.active = true;
        this.setState({ dragging: true, draggingIdx: this.currentIdx }, () => {
          this.animateList();
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        this.currentY = gestureState.moveY;
        Animated.event([{ y: this.point.y }])({ y: gestureState.moveY });
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
      },
      onPanResponderTerminationRequest: (evt, gestureState) => false,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        this.reset();
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
        this.reset();
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      }
    });
  }

componentDidMount() {
 
    this.setState({ arrayHolder: [...this.array] })
 
  }
  joinData = () => {
      this.array.push({title : this.state.textInput_Holder})  
    this.setState({ arrayHolder: [...this.array] })
    this.setState({ visibleModal: null })

  }
  GetItem(item) {

    Alert.alert(item);

  }

  animateList = () => {
    if (!this.active) {
      return;
    }

    requestAnimationFrame(() => {
      // check y value see if we need to reorder
      const newIdx = this.yToIndex(this.currentY);
      if (this.currentIdx !== newIdx) {
        this.setState({
          data: immutableMove(this.state.data, this.currentIdx, newIdx),
          draggingIdx: newIdx
        });
        this.currentIdx = newIdx;
      }

      this.animateList();
    });
  };

  yToIndex = (y: number) => {
    const value = Math.floor(
      (this.scrollOffset + y - this.flatlistTopOffset) / this.rowHeight
    );

    if (value < 0) {
      return 0;
    }

    if (value > this.state.data.length - 1) {
      return this.state.data.length - 1;
    }

    return value;
  };

  reset = () => {
    this.active = false;
    this.setState({ dragging: false, draggingIdx: -1 });
  };

  render() {
    const { data, dragging, draggingIdx } = this.state;

    const renderItem = ({ item, index }, noPanResponder = false) => (
      <View
        onLayout={e => {
          this.rowHeight = e.nativeEvent.layout.height;
        }}
        style={{
          padding: 30,
          borderWidth:2,
          borderRadius:15,
          backgroundColor: colorMap[item],
          flexDirection: "row",
          opacity: draggingIdx === index ? 0 : 1
        }}
      >
        <View {...(noPanResponder ? {} : this._panResponder.panHandlers)}>
          <Text style={{ fontSize: 28,padding:20 }}>*</Text>
        </View>
        <Text style={{ fontSize: 22, textAlign: "center", flex: 1 }}>
          {item.title}
        </Text>
      </View>
    );

    return (
      <View style={styles.container}>
      {this._renderButton('Adicionar Cards', () => this.setState({ visibleModal: 1 }))}
        <Modal 
         isVisible={this.state.visibleModal === 1}>
          {this._renderModalContent()}
        </Modal>

        {dragging && (
          <Animated.View
            style={{
              position: "absolute",
              backgroundColor: "black",
              zIndex: 2,
              width: "100%",
              top: this.point.getLayout().top
            }}
          >
            {renderItem({ item: data[draggingIdx], index: -1 }, true)}
          </Animated.View>
        )}
        <FlatList
          scrollEnabled={!dragging}
          style={{ width: "100%" }}
          data={this.state.arrayHolder}
          extraData={this.state.arrayHolder}  
          renderItem={renderItem}
          onScroll={e => {
            this.scrollOffset = e.nativeEvent.contentOffset.y;
          }}
          onLayout={e => {
            this.flatlistTopOffset = e.nativeEvent.layout.y;
          }}
          scrollEventThrottle={10}
          keyExtractor={item => "" + item}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  box:{
      marginTop:20
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  }
});