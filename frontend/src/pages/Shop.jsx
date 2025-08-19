const Shop = {
  handleClick: (
    x,
    coins,
    setCoins,
    fishList,
    setFishList,
    maxFood,
    setMaxFood,
    foodValue,
    setFoodValue
  ) => {
    const items = [
      { name: "Guppy Fish", cost: 10, action: "addFish" },
      { name: "Food Quality", cost: 20, action: "upgradeFoodValue" },
      { name: "Food Quantity", cost: 20, action: "increaseFoodMax" },
      { name: "Egg Piece", cost: 100, action: "collectEgg", pieces: 0 },
    ];

    const index = Math.floor(x / 150);
    const item = items[index];
    if (!item || coins < item.cost) return;

    setCoins((prev) => prev - item.cost);

    if (item.action === "addFish") {
      setFishList((prev) => [
        ...prev,
        { id: Date.now(), x: 50 + Math.random() * 300, y: 100 + Math.random() * 300, size: 20, eaten: 0, stage: 1, coinTimer: 0 },
      ]);
    } else if (item.action === "upgradeFoodValue") {
      setFoodValue((prev) => prev * 2);
    } else if (item.action === "increaseFoodMax") {
      setMaxFood((prev) => Math.min(prev + 1, 10));
    } else if (item.action === "collectEgg") {
      item.pieces = (item.pieces || 0) + 1;
      if (item.pieces >= 3) alert("Level Complete!");
    }
  },
};

export default Shop;
