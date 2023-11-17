import "App.scss";
import { useState, useEffect, useCallback, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	makeStyles,
	Box,
} from "@mui/material";

import { BigButton } from "components/BigButton";
import { StyledTextField } from "components/StyledTextField";
import { CardRowSmall } from "components/CardRowSmall";
import orderImg from "images/Cafe_Cafe_Logo.png";
// import orderImg from "images/orderImg.png"
import { useNavigator } from "hooks/useNavigator";
import { CartContext } from "App";
import { useTranslation } from "react-i18next";

const styles = {
	overflow: "hidden",
	overflowWrap: "break-word",
	height: "46px",
};

export function OrderPage() {
	const tele = window.Telegram.WebApp;
	const { t, i18n } = useTranslation();
	const { env } = useNavigator();

	const {
		telephone,
		setTelephone,
		address,
		setAddress,
		cartItems,
		settings,
		foods,
		comment,
		setComment,
		totalPrice,
		setTotalPrice,
		optionDelivery,
		setOptionDelivery,
	} = useContext(CartContext);

	const handleChange = (event) => {
		setComment(event.target.value);
	};

	const navigate = useNavigate();

	// const onBackButtonClicked = useCallback(() => {
	//   navigate(-1)
	// }, [cartItems])

	// tele.BackButton.onClick(onBackButtonClicked)

	const onSubmit = useCallback(() => {
		navigate("/payments");
	}, [cartItems, comment]);

	useEffect(() => {
		tele.onEvent("mainButtonClicked", onSubmit);
		// tele.onEvent("backButtonClicked", onBackButtonClicked)

		return () => {
			tele.offEvent("mainButtonClicked", onSubmit);
			// tele.offEvent("backButtonClicked", onBackButtonClicked)
		};
	}, [onSubmit]);

	useEffect(() => {
		if (optionDelivery == "delivery" && !address) {
			tele.MainButton.hide();
		} else {
			tele.MainButton.show();
		}
	}, [address]);

	const onChangeAddress = (e) => {
		setAddress(e.target.value);
	};
	const onChangeTelephone = (e) => {
		setTelephone(e.target.value);
	};

	const onChangeOption = (e) => {
		setOptionDelivery(e.target.value);
	};

	// useEffect(() => {
	//   window.scrollTo({
	//     top: document.body.scrollHeight,
	//     behavior: "smooth",
	//   })
	// }, [optionDelivery])

	useEffect(() => {
		tele.BackButton.show();
		tele.MainButton.setParams({ text: t("PAY") });
	}, []);

	const currentTimestamp = Math.floor(Date.now() / 1000);

	function calculateTotalPrice(products, order) {
		let totalPrice = 0;

		for (const item of order) {
			const product = products.find((p) => p.id === item.id);
			if (product) {
				totalPrice += product.price * item.quantity;

				if (item?.selectedToppings) {
					for (const topping of item.selectedToppings) {
						const toppingData = product.toppings.find((t) => t.title === topping);
						if (toppingData) {
							totalPrice += toppingData.price * item.quantity;
						}
					}
				}
			}
		}

		return totalPrice;
	}

	useEffect(() => {
		console.log("cartItems111", cartItems);
		console.log("foods222", foods);

		setTotalPrice(calculateTotalPrice(foods, cartItems));
	}, []);

	return (
		<>
			<div className="pageContainer">
				<h1 className="title">{t("Order")}</h1>
				<div className="orderContainer">
					<div className="imageContainer">
						<img src={orderImg} alt={"orderImg"} />
					</div>

					<div className="textContainer">
						<div className="text1">
							{" "}
							{t("Order")} № {currentTimestamp}
						</div>
						{/* <div className="text1"> {t("Perfect lunch from Falafel Shop.")}</div> */}
						<div className="text1"> {settings.textToOrder} </div>
						{/* <div className="text_small">{`${discount}% ${t("discount")}`}</div> */}
					</div>
				</div>

				{cartItems && cartItems.length > 0 && (
					<div className="cardsContainer">
						{cartItems.map((food) => {
							return <CardRowSmall food={food} key={food.id} />;
						})}
					</div>
				)}

				{/* <CardRowSmall
          key={9999}
          food={{ id: 9999, title: t("Free delivery"), textColor: "#4AF2A1" }}
        /> */}
				{/* <CardRowSmall
          key={9998}
          food={{
            id: 9998,
            title: t("Discount"),
            price: (totalPrice * discount).toFixed(2),
            textColor: "#4AF2A1",
          }}
        /> */}
				<CardRowSmall
					key={9997}
					food={{
						id: 9997,
						title: t("Total Price:"),
						price: totalPrice,
						// price: totalPriceWithDiscount,
					}}
				/>
			</div>

			<div className="comment_container">
				<div className="title_mini"> {t("Your Comment :")} </div>

				<input
					className="cafe-text-field js-order-comment-field cafe-block"
					rows="1"
					placeholder={t("Add comment")}
					style={styles}
					type="text"
					value={comment}
					onChange={handleChange}
				/>

				<div className="cafe-text-field-hint">
					{t("Any special requests, details, final wishes etc.")}
				</div>
			</div>

			<div className="form">
				<div className="title_mini" style={{ color: "white" }}>
					{t("Choose where you eat")}
				</div>

				<FormControl className="select" style={{ borderColor: "white", color: "white" }}>
					<InputLabel style={{ borderColor: "white", color: "white" }}>
						{t("Select Delivery Option")}
					</InputLabel>
					<Select
						value={optionDelivery}
						onChange={onChangeOption}
						sx={{
							"color": "white",
							".MuiOutlinedInput-notchedOutline": {
								borderColor: "rgb(255, 255, 255)",
							},
							"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
								borderColor: "rgb(255, 255, 255)",
							},
							"&:hover .MuiOutlinedInput-notchedOutline": {
								borderColor: "rgb(255, 255, 255)",
							},
							".MuiSvgIcon-root ": {
								fill: "white !important",
							},
						}}
						labelId="select-filter-by-field-labe;"
						id="select-filter-by-field"
					>
						<MenuItem value="on_site">{t("On Site")}</MenuItem>
						<MenuItem value="take_away">{t("Take Away")}</MenuItem>
						<MenuItem value="delivery">{t("Delivery")}</MenuItem>
					</Select>
				</FormControl>

				{optionDelivery === "delivery" && (
					<Box>
						<StyledTextField
							label={t("Address")}
							value={address}
							onChange={onChangeAddress}
							placeholder={t("Enter address")}
						/>
						<StyledTextField
							label={t("Telephone")}
							value={telephone}
							onChange={onChangeTelephone}
							placeholder={t("Enter Telephone")}
						/>
					</Box>
				)}
			</div>

			{/* {env === "browser" && (
        <BigButton
          title={t("Payments")}
          type={"payments"}
          disable={cartItems.length === 0 ? true : false}
          onClick={onSubmit}
        />
      )} */}

			{env == "browser" && (
				<BigButton title={`${`Buy ${totalPrice} ₪`} `} onClick={onSubmit} />
			)}

			{/* {env === "browser" &&
        (optionDelivery === "on_site" ||
          (optionDelivery === "take_away" && address)) && (
          <BigButton
            title={t("Payments")}
            type={"payments"}
            disable={cartItems.length === 0 ? true : false}
            onClick={onSubmit}
          />
        )} */}
		</>
	);
}
