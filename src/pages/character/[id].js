import { Box, Text, VStack, Heading, List, ListItem, Spinner, extendTheme, ChakraProvider, Image, Grid, GridItem, SimpleGrid } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styled from '@emotion/styled';
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


const ShineBox = styled(Box)`
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to bottom right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0) 40%,
      rgba(255, 255, 255, 0.4) 50%,
      rgba(255, 255, 255, 0) 60%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: rotate(-45deg);
    animation: shine 3s infinite;
  }

  @keyframes shine {
    0% {
      transform: translateX(-100%) rotate(-45deg);
    }
    100% {
      transform: translateX(100%) rotate(-45deg);
    }
  }
`;


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

      console.log(response.data)
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
          <Box maxW="1000px" mx="auto">
            <Grid templateColumns={["1fr", "1fr", "300px 1fr"]} gap={8}>
              <GridItem>
                <Box
                  borderWidth={2}
                  borderColor="brand.900"
                  borderRadius="lg"
                  overflow="hidden"
                  bg="gray.800"
                  boxShadow="xl"
                >
                <ShineBox>
                <Image
                    src={`https://starwars-visualguide.com/assets/img/characters/${id}.jpg`}
                    alt={character.name}
                    width="100%"
                    height="auto"
                    fallbackSrc="/placeholder.jpg"
                  />
                </ShineBox>
           
                  <Box p={4}>
                    <Heading size="lg" color="brand.900" mb={4}>{character.name}</Heading>
                    <Text><strong>Species:</strong> {character.species.length > 0 ? character.species[0] : 'Unknown'}</Text>
                  </Box>
                </Box>
              </GridItem>
              <GridItem>
                <VStack align="stretch" spacing={6}>
                  <Box borderWidth={2} borderColor="brand.900" borderRadius="lg" p={6} bg="gray.800">
                    <Heading size="md" color="brand.900" mb={4}>Physical Characteristics</Heading>
                    <SimpleGrid columns={[1, 2, 3]} spacing={4}>
                      <Box>
                        <Text fontWeight="bold">Height</Text>
                        <Text>{character.height} cm</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold">Mass</Text>
                        <Text>{character.mass} kg</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold">Hair Color</Text>
                        <Text>{character.hair_color}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold">Skin Color</Text>
                        <Text>{character.skin_color}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold">Eye Color</Text>
                        <Text>{character.eye_color}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold">Birth Year</Text>
                        <Text>{character.birth_year}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold">Gender</Text>
                        <Text>{character.gender}</Text>
                      </Box>
                    </SimpleGrid>
                  </Box>
                  
                  <Box borderWidth={2} borderColor="brand.900" borderRadius="lg" p={6} bg="gray.800">
                    <Heading size="md" color="brand.900" mb={4}>Homeworld</Heading>
                    <Text>{character.homeworld}</Text>
                  </Box>
  
                  <Box borderWidth={2} borderColor="brand.900" borderRadius="lg" p={6} bg="gray.800">
                    <Heading size="md" color="brand.900" mb={4}>Films</Heading>
                    <List spacing={2}>
                      {films.map((film, index) => (
                        <ListItem key={index}>{film}</ListItem>
                      ))}
                    </List>
                  </Box>
  
                  <Box borderWidth={2} borderColor="brand.900" borderRadius="lg" p={6} bg="gray.800">
                    <Heading size="md" color="brand.900" mb={4}>Vehicles</Heading>
                    {character.vehicles.length > 0 ? (
                      <List spacing={2}>
                        {character.vehicles.map((vehicle, index) => (
                          <ListItem key={index}>{vehicle}</ListItem>
                        ))}
                      </List>
                    ) : (
                      <Text>No vehicles listed</Text>
                    )}
                  </Box>
  
                  <Box borderWidth={2} borderColor="brand.900" borderRadius="lg" p={6} bg="gray.800">
                    <Heading size="md" color="brand.900" mb={4}>Starships</Heading>
                    {character.starships.length > 0 ? (
                      <List spacing={2}>
                        {character.starships.map((starship, index) => (
                          <ListItem key={index}>{starship}</ListItem>
                        ))}
                      </List>
                    ) : (
                      <Text>No starships listed</Text>
                    )}
                  </Box>
                </VStack>
              </GridItem>
            </Grid>
          </Box>
        )}
      </Box>
    </ChakraProvider>
  );
  
}