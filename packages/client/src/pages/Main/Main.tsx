import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import useNotification from '@/hooks/useNotification'
import { leaderBoardParams } from '@/pages/LeaderBoard/LeaderBoard'
import { getLeaderBoardResults } from '@/store/asyncThunks/leaderboard/getLeaderBoardResults'
import {
  leaderBoardSelector,
  oldLeaderBoardSelector,
} from '@/store/slices/leaderBoardSlice'
import { userSelector } from '@/store/slices/userSlice'
import s from './Main.module.scss'
import Button from '@/components/Button/Button'
import { useNavigate } from 'react-router-dom'
import { AppPath } from '@/types/AppPath'
import { ChangeEventHandler, useEffect, useState } from 'react'
import { setGameCols } from '@/store/slices/gameSlice'
import grid4 from '@/assets/images/other/grid4.svg'
import grid6 from '@/assets/images/other/grid6.svg'
import grid10 from '@/assets/images/other/grid10.svg'
import Logo from '@/components/Logo/Logo'

const Main = () => {
  const navigate = useNavigate()
  const notification = useNotification()
  const dispatch = useAppDispatch()
  const leaderList = useAppSelector(leaderBoardSelector)
  const oldLeaderList = useAppSelector(oldLeaderBoardSelector)
  const currentUser = useAppSelector(userSelector)

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(getLeaderBoardResults(leaderBoardParams))
    }, 10000)

    return () => {
      clearInterval(interval)
    }
  }, [dispatch])

  useEffect(() => {
    if (leaderList !== null && oldLeaderList !== null) {
      const isSame =
        JSON.stringify(oldLeaderList) === JSON.stringify(leaderList)

      if (!isSame) {
        compareArrays(oldLeaderList, leaderList)
      }
    }
  }, [oldLeaderList, leaderList])

  const compareArrays = (
    prevArray: ILeaderBoardData[],
    currentArray: ILeaderBoardData[]
  ) => {
    if (prevArray[0].userData.id !== currentArray[0].userData.id) {
      const message = `Игрок ${currentArray[0].userData.first_name} с рейтингом ${currentArray[0].codeHuntersMemoryGameScore}`

      notification.notifyUser('В игре появился новый лидер', message)
    } else {
      const oldIndex = prevArray.findIndex(
        user => user.userData.id === currentUser.data?.id
      )
      const newIndex = currentArray.findIndex(
        user => user.userData.id === currentUser.data?.id
      )

      if (oldIndex < 3 && newIndex > 2) {
        const message = `Ваше место в рейтинге – ${newIndex + 1}`

        notification.notifyUser('Вы больше не в тройке лидеров', message)
      }
    }
  }

  type GameIcons = {
    easy: string
    hard: string
    veryHard: string
  }

  const gameIcons: GameIcons = {
    easy: grid4,
    hard: grid6,
    veryHard: grid10,
  }

  const [selectedValue, setSelectedValue] = useState<null | string>(null)

  const handleRadioChange: ChangeEventHandler<HTMLInputElement> = event => {
    const selectedValue = event.target.id // Должно быть 'easy', 'hard' или 'veryHard'

    setSelectedValue(selectedValue)

    let cols = 4
    if (selectedValue === 'easy') {
      cols = 4
    } else if (selectedValue === 'hard') {
      cols = 6
    } else if (selectedValue === 'veryHard') {
      cols = 10
    }

    // Вызываем действие для обновления gameCols в хранилище Redux
    dispatch(setGameCols(cols))

    // Сохраняем значение в Local Storage
    localStorage.setItem('gameCols', cols.toString())
  }

  const handlePlayClick = () => {
    navigate(AppPath.GAME)
  }

  return (
    <div className={s.wrapper}>
      <div className={s.content}>
        <div className={s.contentWrapper}>
          <div className={s.textWrapper}>
            <h1 className={s.mainTitle}>
              <div className={s.titleDiv}>
                {'И Г Р А'.split('').map((letter, index) =>
                  letter !== ' ' ? (
                    <Logo logo={false} letter={letter} key={index} />
                  ) : (
                    <div
                      className={letter !== ' ' ? s.titleSpan : s.titleGap}
                      key={index}>
                      {letter}
                    </div>
                  )
                )}
              </div>
              <div className={s.titleDiv}>
                {'M E M O R Y'.split('').map((letter, index) =>
                  letter !== ' ' ? (
                    <Logo logo={false} big={true} letter={letter} key={index} />
                  ) : (
                    <div
                      className={letter !== ' ' ? s.titleSpan : s.titleGap}
                      key={index}>
                      {letter}
                    </div>
                  )
                )}
              </div>
              Запомни свой стек
            </h1>
            <p className={s.subtitle}>
              Узнай, насколько хорошо ты можешь запоминать и сочетать пары
            </p>
            <ol>
              <li className={s.li}>
                <h2>Цель игры:</h2>
                🔎 Найти все одинаковые пары карточек на игровом поле
              </li>
              <li className={s.li}>
                <h2>Ход игры:</h2>
                🟦 Игрок открывает две карточки за один ход
                <br />✅ Если карточки имеют одинаковое изображение, они
                остаются открытыми
                <br />❌ В противном случае они закрываются
              </li>
            </ol>
            {!notification.isGranted && (
              <div className={s.notification}>
                Для получения уведомлений, нажмите на колокольчик
                <button onClick={() => notification.notifyUser('', '')}>
                  🔔
                </button>
              </div>
            )}
          </div>
          <div className={s.levelWrapper}>
            <h2 className={s.pickLevelTitle}>Выбрать сложность:</h2>
            <ul className={s.levels}>
              <li className={s.level}>
                <input
                  id="easy"
                  name="levels"
                  type="radio"
                  className={s.radio}
                  onChange={handleRadioChange}
                />
                <label htmlFor="easy" className={s.levelText}>
                  4X4
                </label>
              </li>
              <li className={s.level}>
                <input
                  id="hard"
                  name="levels"
                  type="radio"
                  className={s.radio}
                  onChange={handleRadioChange}
                />
                <label htmlFor="hard" className={s.levelText}>
                  6X6
                </label>
              </li>
              <li className={s.level}>
                <input
                  id="veryHard"
                  name="levels"
                  type="radio"
                  className={s.radio}
                  onChange={handleRadioChange}
                />
                <label htmlFor="veryHard" className={s.levelText}>
                  6X10
                </label>
              </li>
            </ul>
            <Button
              onClick={handlePlayClick}
              className={s.button}
              disabled={!selectedValue}>
              Играть
            </Button>
            <div className={s.difficultImg}>
              {selectedValue && (
                <img
                  src={gameIcons[selectedValue as keyof GameIcons]}
                  alt={selectedValue}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Main
