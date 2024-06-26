import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Text, VStack, Heading, List, ListItem, Spinner, extendTheme, ChakraProvider } from '@chakra-ui/react';
import axios from 'axios';

// Custom theme
const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      900: '#ffd700', // Star Wars yellow
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.900',
        color: 'brand.900',
      },
    },
  },
});

export default function CharacterDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [character, setCharacter] = useState(null);
  const [films, setFilms] = useState([]);

  useEffect(() => {
    if (id) {
      fetchCharacterDetail();
    }
  }, [id]);

  const fetchCharacterDetail = async () => {
    try {
      const response = await axios.get(`https://swapi.dev/api/people/${id}/`);
      setCharacter(response.data);
      const filmPromises = response.data.films.map((filmUrl) => axios.get(filmUrl));
      const filmResponses = await Promise.all(filmPromises);
      setFilms(filmResponses.map((res) => res.data.title));
    } catch (error) {
      console.error('Error fetching character details:', error);
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Box p={8} minH="100vh" bg="gray.900">
        {!character ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <Spinner size="xl" color="brand.900" />
          </Box>
        ) : (
          <VStack align="start" spacing={6} bg="gray.800" p={8} borderRadius="lg" boxShadow="lg">
            <Heading color="brand.900">{character.name}</Heading>
            <Box borderWidth={1} borderColor="brand.900" p={4} borderRadius="md" width="100%">
              <Text><strong>Height:</strong> {character.height} cm</Text>
              <Text><strong>Mass:</strong> {character.mass} kg</Text>
              <Text><strong>Hair Color:</strong> {character.hair_color}</Text>
              <Text><strong>Eye Color:</strong> {character.eye_color}</Text>
              <Text><strong>Birth Year:</strong> {character.birth_year}</Text>
            </Box>
            <Box width="100%">
              <Heading size="md" mb={4} color="brand.900">Films:</Heading>
              <List spacing={2} styleType="disc" pl={4}>
                {films.map((film, index) => (
                  <ListItem key={index} color="yellow.300">{film}</ListItem>
                ))}
              </List>
            </Box>
          </VStack>
        )}
      </Box>
    </ChakraProvider>
  );
}