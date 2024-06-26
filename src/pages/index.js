import { useState, useEffect } from 'react';
import { Box, SimpleGrid, Button, Text, VStack, HStack, useToast, extendTheme, ChakraProvider, Heading, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure, Spinner, Center } from '@chakra-ui/react';
import axios from 'axios';
import Link from 'next/link';

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

  const fetchCharacters = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://swapi.dev/api/people/?page=${page}`);
      setCharacters(response.data.results);
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
      : [...favorites, { name: character.name, url: character.url }];
    
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
        
        {/* Favorites Toggle Button */}
        <Button onClick={onOpen} mb={4} colorScheme="yellow">
          View Favorites ({favorites.length})
        </Button>

        {/* Favorites Drawer */}
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
                  {favorites.map((favCharacter, index) => (
                    <Box key={favCharacter.name} borderWidth={1} borderColor="brand.900" borderRadius="lg" p={3}>
                      <Text>{favCharacter.name}</Text>
                      <HStack mt={2}>
                        <Link href={`/character/${index + 1 + (page - 1) * 10}`} passHref>
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
                    </Box>
                  ))}
                </VStack>
              )}
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* All Characters Section */}
        <Heading size="lg" mb={4}>All Characters</Heading>
        {isLoading ? (
          <Center h="200px">
            <Spinner size="xl" color="brand.900" thickness="4px" />
          </Center>
        ) : characters.length > 0 ? (
          <SimpleGrid columns={[1, 2, 3]} spacing={6}>
            {characters.map((character, index) => (
              <Box key={character.name} borderWidth={1} borderColor="brand.900" borderRadius="lg" p={4} bg="gray.800" _hover={{ bg: 'gray.700' }} transition="all 0.3s">
                <VStack align="start" spacing={3}>
                  <Text fontSize="xl" fontWeight="semibold">{character.name}</Text>
                  <HStack>
                    <Link href={`/character/${index + 1 + (page - 1) * 10}`} passHref>
                      <Button size="sm" colorScheme="blue">View</Button>
                    </Link>
                    <Button
                      size="sm"
                      colorScheme={favorites.some(fav => fav.name === character.name) ? 'red' : 'green'}
                      onClick={() => toggleFavorite(character)}
                    >
                      {favorites.some(fav => fav.name === character.name) ? 'Remove from Favorites' : 'Add to Favorites'}
                    </Button>
                  </HStack>
                </VStack>
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