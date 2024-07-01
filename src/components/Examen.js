import React, { useState, useEffect } from 'react';
import {
  Box, Button, Text, RadioGroup, Stack, Radio, useToast,
  Center, Heading, HStack
} from '@chakra-ui/react';
import axios from 'axios';

const Exam = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [examStarted, setExamStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/questions');
        const randomQuestions = response.data.sort(() => 0.5 - Math.random()).slice(0, 10);
        setQuestions(randomQuestions);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        toast({
          title: 'Error',
          description: 'Unable to fetch questions',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [toast]);

  useEffect(() => {
    if (examStarted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      if (timeLeft === 0) {
        handleNextQuestion();
      }

      return () => clearInterval(timer);
    }
  }, [timeLeft, examStarted]);

  const startExam = () => {
    setExamStarted(true);
  };

  const handleAnswerSelection = (answerId, isCorrect) => {
    setSelectedAnswer(answerId);
    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }
    setCorrectAnswer(isCorrect);
  };
  

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setCorrectAnswer(null);
      setTimeLeft(15);
    } else {
      setShowResult(true);
      setExamStarted(false);
    }
  };

  if (loading) {
    return (
      <Center height="100vh">
        <Text>Cargando preguntas...</Text>
      </Center>
    );
  }

  if (!examStarted && !showResult) {
    return (
      <Center height="100vh" bgImage="url('https://images.unsplash.com/32/Mc8kW4x9Q3aRR3RkP5Im_IMG_4417.jpg?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" bgSize="cover">
        <Box textAlign="center" p={5} borderRadius="md" boxShadow="lg" bg="white">
          <Heading mb={4}>Algunas reglas de este cuestionario</Heading>
          <Box mb={4}>
            <Text>1. Tendrás solo <span>15 segundos</span> por cada pregunta.</Text>
            <Text>2. Una vez que seleccione su respuesta, no se puede deshacer.</Text>
            <Text>3. No puede seleccionar ninguna opción una vez que se acaba el tiempo.</Text>
            <Text>4. No puedes salir del Quiz mientras estás jugando.</Text>
            <Text>5. Obtendrás puntos en base a tus respuestas correctas.</Text>
          </Box>
          <HStack spacing={4}>
            <Button onClick={() => window.location.reload()} colorScheme="red">
              Salir del Cuestionario
            </Button>
            <Button onClick={startExam} colorScheme="blue">
              Continuar
            </Button>
          </HStack>
        </Box>
      </Center>
    );
  }

  if (showResult) {
    return (
      <Center height="100vh" bgImage="url('https://images.unsplash.com/32/Mc8kW4x9Q3aRR3RkP5Im_IMG_4417.jpg?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" bgSize="cover">
        <Box textAlign="center" p={5} borderRadius="md" boxShadow="lg" bg="white">
          <Heading mb={4}>¡Has completado el cuestionario!</Heading>
          <Text fontSize="xl" mb={4}>Tu puntuación: {score}</Text>
          {score >= 8 && <Text fontSize="lg" color="green.500">¡Excelente trabajo!</Text>}
          {score >= 5 && score < 8 && <Text fontSize="lg" color="blue.500">¡Buen trabajo!</Text>}
          {score >= 1 && score < 5 && <Text fontSize="lg" color="orange.500">Puedes mejorar.</Text>}
          {score === 0 && <Text fontSize="lg" color="red.500">Necesitas estudiar más.</Text>}
          <HStack spacing={4} mt={4}>
            <Button onClick={() => window.location.reload()} colorScheme="blue">
              Cuestionario de repetición
            </Button>
            <Button onClick={() => window.location.reload()} colorScheme="red">
              Salir
            </Button>
          </HStack>
        </Box>
      </Center>
    );
  }

  return (
    <Center height="100vh" bgImage="url('https://images.unsplash.com/32/Mc8kW4x9Q3aRR3RkP5Im_IMG_4417.jpg?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" bgSize="cover">
      <Box textAlign="center" p={5} borderRadius="md" boxShadow="lg" width="500px" bg="white" opacity="0.9">
        <Heading mb={4}>Examen en Linea</Heading>
        <Box mb={4}>
          <Text fontSize="xl">{questions[currentQuestion].question_text}</Text>
        </Box>
        <RadioGroup onChange={handleAnswerSelection} value={selectedAnswer}>
          <Stack direction="column" spacing={3}>
            {questions[currentQuestion].answers.map((answer) => (
              <Box key={answer.id} p={3} borderRadius="md">
                <Radio
                  value={answer.id}
                  isChecked={selectedAnswer === answer.id}
                  isDisabled={selectedAnswer !== null}
                  onChange={() => handleAnswerSelection(answer.id, answer.is_correct)}
                >
                  {answer.answer_text}
                </Radio>
                {selectedAnswer !== null && (
                  <Box
                    mt={1}
                    p={2}
                    borderRadius="md"
                    color="white"
                    bg={answer.is_correct ? 'green' : 'red'}
                  >
                    {answer.is_correct ? 'Correcto ✅' : 'Incorrecto ❌'}
                  </Box>
                )}
              </Box>
            ))}
          </Stack>
        </RadioGroup>
        <Text mt={4}>Tiempo restante: {timeLeft} segundos</Text>
        <Text mt={4}>Pregunta {currentQuestion + 1} de {questions.length}</Text>
        {selectedAnswer !== null && (
          <Button onClick={handleNextQuestion} colorScheme="blue" mt={4}>
            Siguiente
          </Button>
        )}
      </Box>
    </Center>
  );
};

export default Exam;
