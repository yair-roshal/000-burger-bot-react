import React, { useEffect, useState } from "react"
import { Button, Typography, MenuItem, Select, Box } from "@mui/material"
import { useTelegram } from "hooks/useTelegram"
import "App.scss"
import { US, IL, RU, FR } from "country-flag-icons/react/3x2"
import { FlexRowContainer } from "components/AllHelpComponents"
import generatedGitInfo from "helpers/generatedGitInfo.json"
import { useTranslation } from "react-i18next"
import axios from "axios"
import { serverIP, port } from "constants/api"
import { tableData } from "constants/constants"
import { languageButtons } from "../constants/languageButtons";
 
const { gitCommitHash, timeCommitPushed, timeUploadingToNetlify } =
  generatedGitInfo

 
export const Header = () => {
 
  const { user, queryId, onClose } = useTelegram()
  const { t, i18n } = useTranslation()
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const [isTestTextVisible, setTestTextVisible] = useState(false)
  const [tableNumber, setTableNumber] = useState("")
  const [restaurant_name, setRestaurant_name] = useState("")

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const restaurant_name = searchParams.get("restaurant_name")
    setRestaurant_name(restaurant_name)
   }, [])

  const handleTableNumberChange = (event) => {
    setTableNumber(event.target.value)
  }

  const toggleTestText = () => {
    setTestTextVisible(!isTestTextVisible)
  }
  useEffect(() => {
    const language_code = user?.language_code
    if (language_code && currentLanguage !== language_code) {
      setCurrentLanguage(language_code)
      i18n.changeLanguage(language_code)
    }
  }, [user?.language_code])

  const changeLanguage = (language) => {
    setCurrentLanguage(language)
    i18n.changeLanguage(language)
  }

  async function onSendWaiter() {
    const dataPay = {
      queryId: "0",
      cartItems: [],
      comment: "Send Waiter",
      totalPrice: "-",
      paymentMethod: "-",

      address: `tableNumber: ${tableNumber}`,
      optionDelivery: "Send Waiter",

      user_id: user?.id || 0,
      user_name: user?.username || "",
    }

    try {
      const response = await axios.post(serverIP + "/create_order_db", dataPay)
      console.log('Запрос "onSendWaiter" успешно выполнен')
    } catch (error) {
      console.error('Ошибка при выполнении запроса "onSendWaiter":', error)
      return
    }
  }

  return (
    <>
      <FlexRowContainer
        sx={{
          justifyContent: "space-around",
          gap: "10px",
          marginBottom: "10px",
        }}
      >
        <Typography
          sx={{
            border: "2px solid orange",
            padding: "4px 8px ",
            width: "40px",
            height: "40px",
          }}
          variant="body1"
        >
          {currentLanguage}
        </Typography>

        {languageButtons.map((button) => (
          <Button
            key={button.code}
            variant={currentLanguage === button.code ? "contained" : "outlined"}
            onClick={() => changeLanguage(button.code)}
            sx={{ padding: "4px 4px" }}
          >
            {button.flag} &nbsp; &nbsp;
            {button.label}
          </Button>
        ))}
      </FlexRowContainer>

      <Button
        sx={{
          width: "100%",
          color: "black",
          height: "30px",
          border: "1px solid black",
        }}
        onClick={toggleTestText}
      ></Button>

      {isTestTextVisible && (
        <>
          <p className={"testText"}>
            {`Restaurant Name - ${restaurant_name}`}{" "}
          </p>

          <p className={"testText"}>
            {`timeCommitPushed - ${timeCommitPushed}`}{" "}
          </p>

          <p
            className={"testText"}
          >{`timeUploadNetlify - ${timeUploadingToNetlify}`}</p>

          <p className={"testText"}>{`gitCommitHash - ${gitCommitHash}`}</p>

          <p className={"testText"}>{`queryId - ${queryId}`}</p>
        </>
      )}
      <Box sx={{ padding: "10px 20px ", backgroundColor: "#539acd" }}>
        <Select
          value={tableNumber}
          onChange={handleTableNumberChange}
          sx={{ width: "100%", marginBottom: "10px" }}
        >
          {tableData.map((table) => (
            <MenuItem key={table.value} value={table.value}>
              {table.label}
            </MenuItem>
          ))}
        </Select>

        <Button
          variant="contained"
          sx={{ width: "100%", color: "black", height: "30px" }}
          onClick={onSendWaiter}
          disabled={!tableNumber}
        >
          call the waiter{" "}
        </Button>
      </Box>
    </>
  )
}
