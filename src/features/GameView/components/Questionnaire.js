import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput } from 'react-native';
import CircleChecked from '../../../assets/checked-circle.png';
import Circle from '../../../assets/circle-unchecked.png';
import { Touchable } from '../../../shared/components';
import { global, colors } from '../../../shared/styles/theme';
// import GameClock from '../../../assets/game-clock.png';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  questionTitle: {
    ...global.textStyles.title,
    marginBottom: 10
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  optionText: {
  ...global.textStyles.subText,
    marginLeft: 10
  },
  questionContainer: {
    marginTop: 20
  },
  // gameClockContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  //   alignItems: 'center'
  // },
  // gameClockText: {
  //   ...global.textStyles.header,
  //   fontSize: 40,
  //   color: colors.lightGrey,
  //   marginLeft: 10
  // },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    paddingHorizontal: 20,
    marginTop: 10
  },
  input: {
    paddingTop: 0
  }
});

const questionOne = {
  title: 'Why did you give the Ref this rating?',
  options: [
    'Showing favoritism',
    'Misinterpreted the rules',
    'Out of position',
    'Correct call',
    'Wrong call(Specify)',
    'Other(Specify)'
  ]
};

const questionTwo = {
  title: 'Was either team disrespectful to the Referee?',
  options: ['Home', 'Away', 'Neither']
};

// const questionThree = {
//   title: 'If there was a call that changed the game, enter time on the game clock below.'
// };

const Questionnaire = ({ answers = {}, handleAnswerChanges = () => {} }) => {
  const [q1Answer, setQ1Answer] = useState(answers.question_1 || []);
  const [specification, setSpecification] = useState(answers.question_1_specification || '');
  const [q2Answer, setQ2Answer] = useState(answers.question_2 || []);

  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      if (q1Answer.length === 0 && answers.question_1 && answers.question_1.length > 0) {
        setQ1Answer(answers.question_1);
      }
    }
  }, [answers, q1Answer, setQ1Answer]);

  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      if (q2Answer.length === 0 && answers.question_2 && answers.question_2.length > 0) {
        setQ2Answer(answers.question_2);
      }
    }
  }, [answers, q2Answer, setQ2Answer]);

  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      if (
        specification.length === 0 &&
        answers.question_1_specification &&
        answers.question_1_specification.length > 0
      ) {
        setSpecification(answers.question_1_specification);
      }
    }
  }, [answers, specification, setSpecification]);

  const onPressQ1 = useCallback(
    option => {
      const indexOfOption = q1Answer.indexOf(option);
      if (indexOfOption > -1) {
        const answersCopy = q1Answer.slice();
        answersCopy.splice(indexOfOption, 1);
        setQ1Answer(answersCopy);
        handleAnswerChanges('question_1', answersCopy);
      } else {
        setQ1Answer(prev => {
          handleAnswerChanges('question_1', [...prev, option]);
          return [...prev, option];
        });
      }
    },
    [setQ1Answer, q1Answer, handleAnswerChanges]
  );

  const onChangeText = useCallback(
    value => {
      setSpecification(value);
      handleAnswerChanges('question_1_specification', value);
    },
    [setSpecification, handleAnswerChanges]
  );

  const onPressQ2 = useCallback(
    option => {
      const indexOfOption = q2Answer.indexOf(option);
      if (indexOfOption > -1) {
        const answersCopy = q2Answer.slice();
        answersCopy.splice(indexOfOption, 1);
        setQ2Answer(answersCopy);
        handleAnswerChanges('question_2', answersCopy);
      } else {
        setQ2Answer(prev => {
          handleAnswerChanges('question_2', [...prev, option]);
          return [...prev, option];
        });
      }
    },
    [setQ2Answer, q2Answer, handleAnswerChanges]
  );
  const showSpecify = q1Answer.find(option => option.includes('Specify'));

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.questionTitle}>{questionOne.title}</Text>
        {questionOne.options.map(option => {
          const isChecked = q1Answer.indexOf(option) > -1;
          return <Option isChecked={isChecked} key={option} text={option} onPress={onPressQ1} />;
        })}
        {showSpecify && (
          <View style={styles.inputContainer}>
            <TextInput
              value={specification}
              placeholder="Please Specify"
              placeholderTextColor={colors.darkGrey50}
              style={styles.input}
              onChangeText={onChangeText}
              multiline
            />
          </View>
        )}
      </View>
      <View style={styles.questionContainer}>
        <Text style={styles.questionTitle}>{questionTwo.title}</Text>
        {questionTwo.options.map(option => {
          const isChecked = q2Answer.indexOf(option) > -1;
          return <Option isChecked={isChecked} key={option} text={option} onPress={onPressQ2} />;
        })}
      </View>
      {/* <View style={styles.questionContainer}>
        <Text style={styles.questionTitle}>{questionThree.title}</Text>
        <View style={styles.gameClockContainer}>
          <Image source={GameClock} resizeMode="contain" />
          <Text style={styles.gameClockText}>00:00:00</Text>
        </View>
      </View> */}
    </View>
  );
};

const Option = ({ isChecked = false, text = '', onPress = () => {} }) => {
  const onPressCallback = useCallback(() => {
    onPress(text);
  }, [onPress, text]);

  return (
    <Touchable onPress={onPressCallback} style={styles.optionRow}>
      <Image source={isChecked ? CircleChecked : Circle} resizeMode="contain" />
      <Text style={styles.optionText}>{text}</Text>
    </Touchable>
  );
};

export default Questionnaire;
