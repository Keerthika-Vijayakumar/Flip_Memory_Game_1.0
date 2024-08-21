// CardContainer.tsx
import React, { Component, ChangeEvent } from 'react';
import { Navigate } from 'react-router';
import CardsJson from './cards.json';
import Dashboard from '../Dashboard';

interface CardData {
    sno: string;
    cards: number;
    pairs: number;
}

interface CardContainerState {
    cardsData: CardData[];
    formData: CardData;
    navigateToGame: boolean;
}

class CardContainer extends Component<{}, CardContainerState> {
    private selectedCard: any;
    constructor(props: {}) {
        super(props);
        this.state = {
            cardsData: CardsJson || [],
            formData: {
                sno: "",
                cards: 0,
                pairs: 0
            },
            navigateToGame: false
        };
        this.selectedCard = {};
    }

    showToast = (content: string) => {
        var toast = document.getElementById("toast");
        if (toast) {
            toast.className = "show";
            toast.textContent = content
        }
        setTimeout(function () {
            if (toast) {
                toast.className = toast && toast.className.replace("show", "");
                toast.textContent = ''
            }
        }, 3000); // Hide after 3 seconds
    }

    handleAddCard = () => {
        const { formData, cardsData } = this.state;
        const { sno, cards, pairs } = formData
        const cardsNum = cards;
        const pairsNum = pairs;

        if (cardsNum / 2 !== pairs) {
            return this.showToast('Please Provide right pairs');
        }

        if (sno && !isNaN(cardsNum) && !isNaN(pairsNum)) {
            this.setState({
                cardsData: [...cardsData, { sno, cards: cardsNum, pairs: pairsNum }],
                formData: {
                    sno: "",
                    cards: 0,
                    pairs: 0
                }
            });
        }
    };

    handleNavigateToGame = (card: any) => {
        this.setState({ navigateToGame: true });
        this.selectedCard = card;
        return card;
    };

    handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let formDataCopy = this.state.formData;
        if (name === 'sno') {
            formDataCopy[name] = value;
        } else if (name === 'cards' || name === 'pairs') {
            formDataCopy[name] = parseInt(value) || 0;
        }
        this.setState({ formData: formDataCopy })
    };

    getModalForm = () => {
        const { sno, cards, pairs } = this.state.formData;
        return (
            <div className="modal fade" id="myModal" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                            <h4 className="modal-title">Add Card</h4>
                        </div>
                        <div className="modal-body">
                            <div className="input-fields">
                                <input
                                    className='input_style'
                                    type="text"
                                    name="sno"
                                    value={sno}
                                    onChange={this.handleChange}
                                    placeholder="Enter Serial Number"
                                />
                                <input
                                    className='input_style'
                                    type="number"
                                    name="cards"
                                    value={cards ? cards : ''}
                                    onChange={this.handleChange}
                                    placeholder="Enter Number of Cards"
                                />
                                <input
                                    className='input_style'
                                    type="number"
                                    name="pairs"
                                    value={pairs ? pairs : ''}
                                    onChange={this.handleChange}
                                    placeholder="Enter Number of Pairs"
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div className='footer_wrapper'>
                                <button onClick={this.handleAddCard} className='add_button'>Submit</button>
                                <button type="button" className="btn btn-default add_button close_button" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>

                </div>
                <div id="toast"></div>
            </div>
        )
    }
    render() {
        const { cardsData, navigateToGame } = this.state;
        const { selectedCard } = this;
        // if (navigateToGame) {
        //     return <Navigate to={`/card?grid${selectedCard.cards}`} state={selectedCard.cards} />
        // }
        if (navigateToGame) {
            return <Dashboard grid={selectedCard.cards} />
        }
        return (
            <>
                <div className='add_button_wrapper'>
                    <button data-toggle="modal" className='add_button' data-target="#myModal">Add Card</button>
                </div>
                {this.getModalForm()}
                <div className="cards-container">
                    {cardsData.map((card, index) => (
                        <a className="card" onClick={() => this.handleNavigateToGame(card)}>
                            <div className='card_sno'>{card.sno}</div>
                            <div className='card_content_wrapper'>
                                <div className='card_content_header'>{card.cards}<span style={{ fontSize: '1rem' }}>Cards</span></div>
                                <div className='card_content_subheader'>{card.pairs}<span style={{ fontSize: "0.7rem" }}>pairs</span></div>
                            </div>
                        </a>
                    ))}
                </div>
            </>
        );
    }
}

export default CardContainer;
