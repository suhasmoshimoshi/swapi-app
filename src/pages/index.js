import { useState, useEffect } from 'react';
import { Box, SimpleGrid, Button, Badge, Text, VStack, HStack, useToast, extendTheme, ChakraProvider, Heading, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure, Spinner, Center, Image } from '@chakra-ui/react';
import axios from 'axios';
import Link from 'next/link';
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

// Styled component for shine effect
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


export default function Home() {
  const [characters, setCharacters] = useState([]);
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchCharacters();
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, [page]);

  const getCharacterImageUrl = (characterId) => {
    return `https://starwars-visualguide.com/assets/img/characters/${characterId}.jpg`;
  };

  const fetchCharacters = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://swapi.dev/api/people/?page=${page}`);
      const charactersWithImages = response.data.results.map((character, index) => ({
        ...character,
        id: index + 1 + (page - 1) * 10,
        imageUrl: getCharacterImageUrl(index + 1 + (page - 1) * 10)
      }));
      setCharacters(charactersWithImages);
    } catch (error) {
      console.error('Error fetching characters:', error);
      toast({
        title: 'Error fetching characters',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = (character) => {
    const updatedFavorites = favorites.some(fav => fav.name === character.name)
      ? favorites.filter(fav => fav.name !== character.name)
      : [...favorites, { name: character.name, url: character.url, imageUrl: character.imageUrl, id: character.id }];
    
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    
    toast({
      title: favorites.some(fav => fav.name === character.name) ? 'Removed from favorites' : 'Added to favorites',
      status: favorites.some(fav => fav.name === character.name) ? 'warning' : 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <ChakraProvider theme={theme}>
      <Box p={8}>
        <Text fontSize="4xl" fontWeight="bold" mb={8} textAlign="center">Star Wars Characters</Text>
        
        <Button onClick={onOpen} mb={4} colorScheme="yellow">
          View Favorites ({favorites.length})
        </Button>

        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent bg="gray.800" color="brand.900">
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">Favorites</DrawerHeader>
            <DrawerBody>
              {favorites.length === 0 ? (
                <Text>No favorites added yet.</Text>
              ) : (
                <VStack align="stretch" spacing={4}>
                  {favorites.map((favCharacter) => (
                    <Box key={favCharacter.name} borderWidth={1} borderColor="brand.900" borderRadius="lg" p={3}>
                      <HStack>
                        <Image src={favCharacter.imageUrl} alt={favCharacter.name} boxSize="50px" objectFit="cover" fallbackSrc="/placeholder.jpg" />
                        <VStack align="start" spacing={2}>
                          <Text>{favCharacter.name}</Text>
                          <HStack>
                            <Link href={`/character/${favCharacter.id}`} passHref>
                              <Button size="sm" colorScheme="blue">View</Button>
                            </Link>
                            <Button
                              size="sm"
                              colorScheme="red"
                              onClick={() => toggleFavorite(favCharacter)}
                            >
                              Remove
                            </Button>
                          </HStack>
                        </VStack>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              )}
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        <Heading size="lg" mb={4}>All Characters</Heading>
        {isLoading ? (
          <Center h="200px">
            <Spinner size="xl" color="brand.900" thickness="4px" />
          </Center>
        ) : characters.length > 0 ? (
          <SimpleGrid columns={[1, 2, 3 ,4]} spacing={6}>
            {characters.map((character, index) => (
              <Box 
                key={character.name} 
                borderWidth={2}
                borderColor="brand.900"
                borderRadius="lg"
                overflow="hidden"
                bg="gray.800"
                _hover={{ transform: 'scale(1.05)', transition: 'transform 0.3s' }}
              >
                <ShineBox>
                  <Image 
                    src={character.imageUrl} 
                    alt={character.name} 
                    w="100%" 
                    h="250px" 
                    objectFit="cover" 
                    fallbackSrc="/placeholder.jpg"
                  />
                </ShineBox>
                <Box p={4}>
                  <Heading size="md" mb={2}>{character.name}</Heading>
                  <HStack mb={3}>
                    <Badge colorScheme="yellow">Height: {character.height}</Badge>
                    <Badge colorScheme="yellow">Mass: {character.mass}</Badge>
                  </HStack>
                  <HStack justifyContent="space-between">
                    <Link href={`/character/${index + 1 + (page - 1) * 10}`} passHref>
                      <Button size="sm" colorScheme="blue">View Details</Button>
                    </Link>
                    <Button
                      size="sm"
                      colorScheme={favorites.some(fav => fav.name === character.name) ? 'red' : 'green'}
                      onClick={() => toggleFavorite(character)}
                    >
                      {favorites.some(fav => fav.name === character.name) ? 'Unfavorite' : 'Favorite'}
                    </Button>
                  </HStack>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        ) : (
          <Text>No characters found.</Text>
        )}
        
        <HStack justifyContent="center" mt={8} spacing={4}>
          <Button onClick={() => setPage(page - 1)} isDisabled={page === 1} bg="gray.700" color="brand.900" _hover={{ bg: 'gray.600' }}>Previous</Button>
          <Text fontSize="xl">{page}</Text>
          <Button onClick={() => setPage(page + 1)} isDisabled={characters.length < 10} bg="gray.700" color="brand.900" _hover={{ bg: 'gray.600' }}>Next</Button>
        </HStack>
      </Box>
    </ChakraProvider>
  );
}