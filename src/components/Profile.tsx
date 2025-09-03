import React, { useEffect, useState } from "react";
import {
  User,
  Calendar,
  Phone,
  Mail,
  Users,
  Edit3,
  Check,
  X,
  Camera,
} from "lucide-react";

interface UserProfile {
  NOM: string;
  PRENOM: string;
  DATE_NAISSANCE: string;
  GENRE: string;
  TELEPHONE: string;
  EMAIL: string;
}

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<UserProfile | null>(null);

  // API Configuration
  const API_BASE_URL = "http://127.0.0.1:8000/api";
  const getAuthToken = () => localStorage.getItem("auth_token");

  const apiHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${getAuthToken()}`,
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/personnes/${JSON.parse(localStorage.getItem("user") || "{}").personne.ID_PERSONNE}`,
        {
          method: "GET",
          headers: apiHeaders,
        }
      );

      if (!response.ok) throw new Error("Erreur lors de la récupération du profil");

      const currentUser = await response.json();

      if (!currentUser?.data.ID_PERSONNE) {
        console.error("Utilisateur non trouvé dans le localStorage");
        return;
      }

      setProfile({
        "NOM" : currentUser.data.NOM,
        "PRENOM" : currentUser.data.PRENOM,
        "DATE_NAISSANCE" : currentUser.data.DATE_NAISSANCE,
        "GENRE" : currentUser.data.GENRE,
        "TELEPHONE" : currentUser.data.TELEPHONE,
        "EMAIL" : currentUser.data.EMAIL
      });
      setFormData({
        "NOM" : currentUser.data.NOM,
        "PRENOM" : currentUser.data.PRENOM,
        "DATE_NAISSANCE" : currentUser.data.DATE_NAISSANCE,
        "GENRE" : currentUser.data.GENRE,
        "TELEPHONE" : currentUser.data.TELEPHONE,
        "EMAIL" : currentUser.data.EMAIL
      });
    } catch (error) {
      console.error("Erreur chargement profil:", error);
    }
  };

  // Charger le profil depuis l'API
  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!formData) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/personnes/${JSON.parse(localStorage.getItem("user") || "{}").personne.ID_PERSONNE}`,
        {
          method: "PUT",
          headers: apiHeaders,
          body: JSON.stringify(formData),
        }
      );
      console.log(formData)

      if (!response.ok) throw new Error("Erreur lors de la sauvegarde");

      const updated = await response.json();
      fetchProfile();
      setProfile(updated);
      setFormData(updated);
      setIsEditing(false);
    } catch (error) {
      console.error("Erreur sauvegarde:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

const getGenderLabel = (genre?: string) => {
  if (!genre) return ""; // ou "Non défini"
  switch (genre.toLowerCase()) {
    case "homme":
      return "Masculin";
    case "femme":
      return "Féminin";
    default:
      return genre;
  }
};

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return "";
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (!profile || !formData) {
    return (
      <div className="text-center py-10">Chargement du profil...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* === CARTE PROFIL === */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <User className="h-12 w-12 text-blue-600" />
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors shadow-lg">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <h2 className="text-xl font-bold text-white mt-4">
                  {profile.PRENOM} {profile.NOM}
                </h2>
                <p className="text-blue-100 text-sm">
                  {calculateAge(profile.DATE_NAISSANCE)} ans
                </p>
              </div>
              <div className="p-6 space-y-4 text-gray-600">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <span className="text-sm">{profile.EMAIL}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-green-500" />
                  <span className="text-sm">{profile.TELEPHONE}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-purple-500" />
                  <span className="text-sm">{getGenderLabel(profile.GENRE)}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  <span className="text-sm">{formatDate(profile.DATE_NAISSANCE)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* === FORMULAIRE INFOS === */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Informations Personnelles
                </h3>
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Modifier</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg flex items-center space-x-2"
                    >
                      <X className="h-4 w-4" />
                      <span>Annuler</span>
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      <span>{loading ? "Sauvegarde..." : "Sauvegarder"}</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nom
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.NOM}
                      onChange={(e) =>
                        setFormData({ ...formData, NOM: e.target.value })
                      }
                      className="w-full px-4 py-3 border rounded-xl"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-xl">
                      {profile.NOM}
                    </div>
                  )}
                </div>

                {/* Prénom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Prénom
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.PRENOM}
                      onChange={(e) =>
                        setFormData({ ...formData, PRENOM: e.target.value })
                      }
                      className="w-full px-4 py-3 border rounded-xl"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-xl">
                      {profile.PRENOM}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.EMAIL}
                      onChange={(e) =>
                        setFormData({ ...formData, EMAIL: e.target.value })
                      }
                      className="w-full px-4 py-3 border rounded-xl"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-xl">
                      {profile.EMAIL}
                    </div>
                  )}
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Téléphone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.TELEPHONE}
                      onChange={(e) =>
                        setFormData({ ...formData, TELEPHONE: e.target.value })
                      }
                      className="w-full px-4 py-3 border rounded-xl"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-xl">
                      {profile.TELEPHONE}
                    </div>
                  )}
                </div>

                {/* Date naissance */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date de naissance
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={formData.DATE_NAISSANCE}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          DATE_NAISSANCE: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border rounded-xl"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-xl">
                      {formatDate(profile.DATE_NAISSANCE)}
                    </div>
                  )}
                </div>

                {/* Genre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Genre
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.GENRE}
                      onChange={(e) =>
                        setFormData({ ...formData, GENRE: e.target.value })
                      }
                      className="w-full px-4 py-3 border rounded-xl"
                    >
                      <option value="">Sélectionner</option>
                      <option value="homme">Masculin</option>
                      <option value="femme">Féminin</option>
                    </select>
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-xl">
                      {getGenderLabel(profile.GENRE)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
};

export default Profile;
