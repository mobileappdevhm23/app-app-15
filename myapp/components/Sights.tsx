import React from 'react';
import { Text, StyleSheet, View, Button, TouchableOpacity, Modal } from 'react-native';
import Score from '../components/memoryGame/Score';
import Card from '../components/memoryGame/Card';

const images = [
  require('../assets/sights/BmwWelt.jpg'),
  require('../assets/sights/EnglischerGarten.jpg'),
  require('../assets/sights/Frauenkirche.jpg'),
  require('../assets/sights/Marienplatz.jpg'),
  require('../assets/sights/Nymphenburg.jpg'),
  require('../assets/sights/Residenz.jpg'),
];

interface CardType {
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
          <Text style={styles.infoText}>{cardInfo.info}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default class Sights extends React.Component<{}, SightsState> {
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

    cards[1].info = 'One of the largest urban parks in the world, the English Garden offers a serene escape from the city. Visitors can relax by the streams and ponds, enjoy a picnic, or even surf on the artificial wave at the Eisbach.';
    cards[3].info = 'Marienplatz is the central square in Munich and is home to the impressive New Town Hall with its famous Glockenspiel. Visitors can enjoy the lively atmosphere, admire the beautiful architecture, and witness the Glockenspiels performance.';
    cards[0].info = 'Car enthusiasts will enjoy a visit to the BMW Museum, where the history of BMW automobiles and motorcycles is showcased. Adjacent to the museum is BMW Welt, a futuristic exhibition and delivery center where visitors can experience the brands latest innovations.';
    cards[2].info = 'The iconic Cathedral of Our Blessed Lady, known as Frauenkirche, is a symbol of Munich. Its twin towers dominate the citys skyline, and visitors can climb to the top for panoramic views. The interior features beautiful Gothic architecture and stunning stained glass windows.';
    cards[4].info = 'This stunning Baroque palace is surrounded by expansive gardens and was the summer residence of the Bavarian monarchs. Visitors can explore the opulent rooms, stroll through the picturesque gardens, and visit the nearby Marstallmuseum.';
    cards[5].info = 'The Residenz is the former royal palace of the Bavarian monarchs and is one of Europes most magnificent palace complexes. Visitors can explore the opulent rooms, including the Antiquarium, the largest Renaissance hall north of the Alps, and the stunning Court Garden.';

    cards[1].name = 'ENGLISH GARDEN:';
    cards[3].name = 'MARIENPLATZ:';    
    cards[0].name = 'BMW WELT/MUSEUM:';
    cards[2].name = 'FRAUENKIRCHE:';
    cards[4].name = 'NYMPHENBURG PALACE:';
    cards[5].name = 'MUNICH RESIDENCE:';

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
        // All matches found
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
});
