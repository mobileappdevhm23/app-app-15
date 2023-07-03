import React, { ReactNode } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Modal, Image } from 'react-native';
import Score from '../components/memoryGame/Score';
import Card from '../components/memoryGame/Card';
import { sendNotification } from './notification';

const images = [
  require('../assets/food/Bier.jpg'),
  require('../assets/food/Brezen.jpg'),
  require('../assets/food/Kaiserschmarrn.jpg'),
  require('../assets/food/Leberkaese.jpg'),
  require('../assets/food/Semmelknoedel.jpg'),
  require('../assets/food/Weißwurst.jpg'),
];


interface CardType {
  info: ReactNode;
  index: any;
  src: any;
  name: string;
  color?: string;
  is_open?: boolean;
  id?: string;
}

interface SightsState {
  current_selection: CardType[];
  selected_pairs: string[];
  score: number;
  cards: CardType[];
  showMatchScreen: boolean;
  showInfoModal: boolean;
  selectedCardInfo: CardType | null;
}

class MatchScreen extends React.Component<{ onClose: () => void, cardInfo: CardType }, {}> {
  render() {
    const { onClose, cardInfo } = this.props;
    return (
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.nameText}>{cardInfo.name}</Text>
          <View style={styles.imageContainer}>
            <Image source={cardInfo.src} style={styles.image} />
          </View>
          <Text style={styles.infoText}>{cardInfo.info}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default class Food extends React.Component<{}, SightsState> {
  cards: CardType[];

  constructor(props: {}) {
    super(props);
    this.renderCards = this.renderCards.bind(this);
    this.resetCards = this.resetCards.bind(this);

    let cards: CardType[] = images.map((src, index) => ({
      src: src,
      name: `Sight${index + 1}`,
      info: 'Information about the sight...',
    }));

    cards[2].info = 'A sweet shredded pancake dusted with powdered sugar. Often served with applesauce.';
    cards[1].info = 'Salty, baked dough in the shape of a large knot. They are a popular snack in Munich.';
    cards[0].info = 'Munich is famous for its beer, and experiencing the local beer culture is a must-do. Enjoy a variety of traditional Bavarian beers such as Helles, Märzen, or Weissbier.';
    cards[3].info = 'A hearty loaf made from a mixture of ground beef and pork. Sliced and commonly served as a snack or in sandwiches.';
    cards[4].info = 'Bread dumplings made from stale rolls, eggs, and spices. They are a popular side dish in Bavarian cuisine.';
    cards[5].info = 'A classic Bavarian sausage traditionally served with sweet mustard and pretzels for breakfast.';

    cards[2].name = 'Kaiserschmarrn:';
    cards[1].name = 'Pretzels (Brezen):';    
    cards[0].name = 'Bavarian Beer:';
    cards[3].name = 'Leberkäse:';
    cards[4].name = 'Semmelknödel:';
    cards[5].name = 'Weißwurst:';

    let clone = JSON.parse(JSON.stringify(cards));

    this.cards = cards.concat(clone);
    this.cards.map((obj: CardType) => {
      let id = Math.random().toString(36).substring(7);
      obj.id = id;
      obj.is_open = false;
    });

    this.shuffleArray(this.cards);

    this.state = {
      current_selection: [],
      selected_pairs: [],
      score: 0,
      cards: this.cards,
      showMatchScreen: false,
      showInfoModal: false,
      selectedCardInfo: null,
    };
  }

  shuffleArray(array: CardType[]) {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  resetCards() {
    let cards = this.cards.map((obj: CardType) => {
      obj.is_open = false;
      return obj;
    });

    cards = this.shuffleArray(cards);

    this.setState({
      current_selection: [],
      selected_pairs: [],
      cards: cards,
      score: 0,
      showMatchScreen: false,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.body}>{this.renderRows.call(this)}</View>
        <Score score={this.state.score} />
        <TouchableOpacity onPress={this.resetCards} style={styles.resetButton}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
        {this.state.showMatchScreen && this.state.selectedCardInfo && (
          <Modal visible={true} transparent={true}>
            <MatchScreen onClose={this.closeMatchScreen} cardInfo={this.state.selectedCardInfo} />
          </Modal>
        )}
      </View>
    );
  }

  clickCard(id: string) {
    let selected_pairs = this.state.selected_pairs;
    let current_selection = this.state.current_selection;
    let score = this.state.score;

    let index = this.state.cards.findIndex((card: CardType) => {
      return card.id === id;
    });

    let cards = this.state.cards;

    if (cards[index].is_open === false && selected_pairs.indexOf(cards[index].name) === -1) {
      cards[index].is_open = true;

      current_selection.push({
        index: index,
        name: cards[index].name,
        info: undefined,
        src: undefined
      });

      if (current_selection.length === 2) {
        if (current_selection[0].name === current_selection[1].name) {
          score += 1;
          selected_pairs.push(cards[index].name);
          this.setState({
            showMatchScreen: true,
            selectedCardInfo: cards[index],
          });
        } else {
          cards[current_selection[0].index].is_open = false;

          setTimeout(() => {
            cards[index].is_open = false;
            this.setState({
              cards: cards,
            });
          }, 500);
        }

        current_selection = [];
      }

      if (selected_pairs.length === images.length) {
        sendNotification();
      }

      this.setState({
        score: score,
        cards: cards,
        current_selection: current_selection,
        showInfoModal: true,
      });
    }
  }

  closeMatchScreen = () => {
    this.setState({
      showMatchScreen: false,
      selectedCardInfo: null,
      showInfoModal: false,
    });
  };

  renderRows() {
    let contents = this.getRowContents(this.state.cards);
    return contents.map((cards, index) => {
      return (
        <View key={index} style={styles.row}>
          {this.renderCards(cards)}
        </View>
      );
    });
  }

  renderCards(cards: CardType[]) {
    return cards.map((card: CardType, index: number) => {
      return (
        <Card
          key={index}
          src={card.src}
          name={card.name}
          color={card.color}
          is_open={card.is_open}
          clickCard={this.clickCard.bind(this, card.id)}
        >
          <Text style={styles.cardInfo}>{card.info}</Text>
        </Card>
      );
    });
  }
  

  getRowContents(cards: CardType[]) {
    let contents_r: CardType[][] = [];
    let contents: CardType[] = [];
    let count = 0;
    cards.forEach((item: CardType) => {
      count += 1;
      contents.push(item);
      if (count === 4) {
        contents_r.push(contents);
        count = 0;
        contents = [];
      }
    });

    return contents_r;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B49292',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 120,
  },
  resetButtonText: {
    color: '#B49292',
    fontSize: 16,
    fontWeight: 'bold',
  },
  matchScreenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchScreenText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#B49292',
    alignContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 18,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 5,
  },
  infoText: {
    fontSize: 20,
    textAlign: 'center',
    margin: 20,
  },
  nameText: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '900',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    margin: 10,
  },
});
